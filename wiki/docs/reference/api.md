---
sidebar_position: 2
---

# API Reference

## REST API (pi-ctlr)

Base URL: `http://pi-ctlr:8000`

### GET /state

Returns current state with telemetry and countdown.

```json
{
  "state": "preflight",
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "countdown": 8,
  "expected_nodes": ["cam-01", "cam-02"],
  "confirmed_nodes": ["cam-01"],
  "all_confirmed": false,
  "cpu": 12.5,
  "memory": 45.2,
  "storage": 67.8
}
```

### POST /preflight

Start preflight with scheduled recording.

```json
{
  "start_in": 10,
  "nodes": ["cam-01", "cam-02"]
}
```

### POST /cancel

Cancel preflight and return to idle. Only valid during `preflight` state.

### POST /stop

Stop recording and transition to finishing. Only valid during `recording` state.

### GET /health

```json
{
  "status": "ok",
  "mqtt_connected": true
}
```

---

## MQTT

### Broker

- **Host:** `pi-ctlr`
- **Port:** 1883

### Controller Topics

#### Published by Controller

| Topic | Description |
|-------|-------------|
| `ctlr/status` | Current state (on every state change) |
| `ctlr/command` | Commands to nodes |

#### Subscribed by Controller

| Topic | Description |
|-------|-------------|
| `ctlr/node/+/ready` | Node ready confirmations |
| `ctlr/node/+/status` | Node status updates |

### Command Payloads

#### prepare
```json
{
  "action": "prepare",
  "uuid": "550e8400-...",
  "start_at": "2026-03-23T18:10:00",
  "nodes": ["cam-01", "cam-02"]
}
```

#### start
```json
{
  "action": "start",
  "uuid": "550e8400-..."
}
```

#### stop
```json
{
  "action": "stop",
  "uuid": "550e8400-..."
}
```

#### abort
```json
{
  "action": "abort",
  "uuid": "550e8400-...",
  "reason": "User cancelled"
}
```

---

## Camera Node Topics

#### Published by Node

| Topic | When | Description |
|-------|------|-------------|
| `ctlr/node/{id}/ready` | Preflight | Ready confirmation |
| `ctlr/node/{id}/status` | Periodic | Health + recording metrics |

#### Node Ready Payload

```json
{
  "node_id": "cam-01",
  "ready": true
}
```

Or on error:
```json
{
  "node_id": "cam-01",
  "ready": false,
  "error": "Hardware check failed"
}
```

#### Node Status Payload

```json
{
  "node_id": "cam-01",
  "node_name": "Front Camera",
  "state": "recording",
  "health": "ok",
  "session_uuid": "db654093-...",
  "recording": {
    "duration_secs": 125,
    "file_size_mb": 487.2,
    "fps_actual": 29.8,
    "frames_dropped": 12
  },
  "system": {
    "disk_free_mb": 28450,
    "cpu_percent": 45.2
  },
  "timestamp": "2026-03-23T18:30:00Z"
}
```

#### Health Values

| Value | Meaning |
|-------|---------|
| `ok` | All systems nominal |
| `warning` | Degraded (high CPU, frames dropping) |
| `error` | Fatal issue, recording stopped |
