---
sidebar_position: 2
---

# API Reference

## MQTT Broker

- **Host:** `pi-ctlr`
- **Port:** 1883 (default) or 8883 (TLS)
- **Network:** Local WiFi + Tailscale VPN

## Topic Structure

```
<site>/<device-type>/<device-id>/<data-type>
```

| Segment | Example | Description |
|---------|---------|-------------|
| site | `melb-01` | Deployment location |
| device-type | `ctlr`, `picam` | Device category |
| device-id | `01`, `02`, ... | Device number |
| data-type | `cmd`, `status` | Message type |

## Controller Topics

| Topic | Direction | Retained | Description |
|-------|-----------|----------|-------------|
| `melb-01/ctlr/status` | pi-ctlr → all | Yes | Controller status |
| `melb-01/session/start` | pi-ctlr → all | No | Start with UUID + start_time |
| `melb-01/session/stop` | pi-ctlr → all | No | Stop command |

## Camera Node Topics

| Topic | Direction | Retained | Description |
|-------|-----------|----------|-------------|
| `melb-01/picam/+/cmd` | pi-ctlr → picam | No | Commands: `start`, `stop` |
| `melb-01/picam/+/status` | picam → pi-ctlr | Yes | Node status |

`+` is MQTT wildcard — subscribe to all picam nodes.

## QoS Levels

| Message Type | QoS |
|--------------|-----|
| Commands | 1 |
| Status | 1 |

---

## Message Payloads

### ctlr/status

```json
{
  "state": "recording",
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "devices_online": 3,
  "storage_free_mb": 128000,
  "cpu_pct": 23,
  "temp_c": 48,
  "uptime_s": 86400
}
```

| Field | Type | Description |
|-------|------|-------------|
| state | string | `idle`, `preflight`, `recording` |
| session_uuid | string | Current session UUID (null if idle) |
| devices_online | int | Connected picam count |
| storage_free_mb | int | Free space for recordings |
| cpu_pct | int | CPU usage % |
| temp_c | int | Temperature |
| uptime_s | int | Seconds since boot |

### picam/status

```json
{
  "state": "recording",
  "storage_free_mb": 12400,
  "cpu_pct": 45,
  "temp_c": 52,
  "rsync_status": "idle",
  "rsync_pending_mb": 0,
  "recording_file": "2024-01-15_14-30-00.mp4",
  "camera_ok": true,
  "uptime_s": 3600
}
```

| Field | Type | Description |
|-------|------|-------------|
| state | string | `idle`, `preflight`, `recording`, `error` |
| storage_free_mb | int | SD card free space |
| cpu_pct | int | CPU usage % |
| temp_c | int | Temperature (Pi Zero runs hot) |
| rsync_status | string | `idle`, `syncing`, `error` |
| rsync_pending_mb | int | Data waiting to sync |
| recording_file | string | Current file (null if idle) |
| camera_ok | bool | Camera hardware healthy |
| uptime_s | int | Seconds since boot |

### session/start

```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "start_time": 1679900000
}
```

### picam/cmd

```json
{
  "cmd": "start",
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Command | Description |
|---------|-------------|
| `start` | Begin recording with UUID |
| `stop` | Stop recording |
