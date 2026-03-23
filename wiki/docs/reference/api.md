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
| device-type | `picam`, `phone`, `watch`, `sensor` | Device category |
| device-id | `01`, `02`, ... | Device number (scalable) |
| data-type | `cmd`, `status`, `heartbeat` | Message type |

## Session Topics

| Topic | Direction | Retained | Description |
|-------|-----------|----------|-------------|
| `melb-01/session/start` | pi-ctlr → all | No | Start with UUID + start_time |
| `melb-01/session/stop` | pi-ctlr → all | No | Stop command |
| `melb-01/session/state` | pi-ctlr → all | Yes | `idle`, `preflight`, `recording` |

## Device Topics

### Camera Nodes (picam/01..n)

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb-01/picam/+/cmd` | pi-ctlr → picam | Commands: `start`, `stop` |
| `melb-01/picam/+/status` | picam → pi-ctlr | Status: `ready`, `recording`, `error` |
| `melb-01/picam/+/heartbeat` | picam → pi-ctlr | Periodic keepalive |

`+` is MQTT wildcard — subscribe to all picam nodes.

### Phone / Watch

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb-01/phone/status` | phone → pi-ctlr | Connection status |
| `melb-01/phone/heartbeat` | phone → pi-ctlr | Periodic keepalive |
| `melb-01/watch/status` | watch → pi-ctlr | Connection status |
| `melb-01/watch/heartbeat` | watch → pi-ctlr | Periodic keepalive |

### Onboard Sensors (pi-ctlr)

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb-01/sensor/can` | internal | CAN bus data |
| `melb-01/sensor/imu` | internal | IMU data |
| `melb-01/sensor/gnss` | internal | GPS/GNSS data |

## QoS Levels

| Message Type | QoS | Rationale |
|--------------|-----|-----------|
| Commands | 1 | Must be delivered |
| Status | 1 | Important for state sync |
| Heartbeat | 0 | Frequent, loss acceptable |

## Message Payloads

### session/start
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "start_time": 1679900000
}
```

### picam status
```json
{
  "state": "recording",
  "disk_free_mb": 12400,
  "temp_c": 52
}
```

### heartbeat
```json
{
  "ts": 1679900123,
  "uptime": 3600
}
```
