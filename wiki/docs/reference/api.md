# API Reference

## MQTT Broker

- **Host:** Pi 4 controller (`ctlr`)
- **Port:** 1883 (default) or 8883 (TLS)
- **Network:** Tailscale VPN

## Topic Structure

```
<site>/<controller>/<device-type>/<device-id>/<data-type>/<uuid>
```

| Segment | Example | Description |
|---------|---------|-------------|
| site | `melb-01` | Deployment location |
| controller | `ctlr` | Always `ctlr` |
| device-type | `cam`, `phone`, `watch`, `can`, `imu`, `gnss` | Device category |
| device-id | `cam-01`, `phone-01` | Unique device identifier |
| data-type | `cmd`, `status`, `sensor`, `data` | Message type |
| uuid | `550e8400-e29b...` | Session UUID (UUIDv4) |

## Session Topics

| Topic | Direction | Retained | Description |
|-------|-----------|----------|-------------|
| `melb-01/ctlr/session/start` | ctlr → all | No | Session start command |
| `melb-01/ctlr/session/state` | ctlr → all | Yes | Current state: `idle`, `preflight`, `recording` |
| `melb-01/ctlr/session/last` | ctlr → all | Yes | Last session UUID for rejoin |

## Device Topics

### Camera (Pi Zero)

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb-01/ctlr/cam/cam-01/cmd/<uuid>` | ctlr → cam | Commands: `start`, `stop` |
| `melb-01/ctlr/cam/cam-01/status/<uuid>` | cam → ctlr | Status: `ready`, `recording`, `error` |

### Phone / Watch

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb-01/ctlr/phone/phone-01/sensor/<uuid>` | phone → ctlr | Sensor data stream |
| `melb-01/ctlr/watch/watch-01/sensor/<uuid>` | watch → ctlr | Sensor data stream |

### Onboard Sensors (Pi 4)

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb-01/ctlr/can/can-01/data/<uuid>` | sensor → ctlr | CAN bus data |
| `melb-01/ctlr/imu/imu-01/data/<uuid>` | sensor → ctlr | IMU data |
| `melb-01/ctlr/gnss/gnss-01/data/<uuid>` | sensor → ctlr | GPS/GNSS data |

## QoS Levels

| Message Type | QoS | Rationale |
|--------------|-----|-----------|
| Commands | 1-2 | Must be delivered |
| Status | 0-1 | Important but recoverable |
| High-frequency data (CAN/IMU/GNSS) | 0 | Volume over guarantee |
