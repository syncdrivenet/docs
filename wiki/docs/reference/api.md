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
| site | `melb` | Deployment location |
| device-type | `picam`, `phone`, `watch`, `sensor` | Device category |
| device-id | `picam-01`, `phone` | Unique device identifier |
| data-type | `cmd`, `status`, `data` | Message type |

## Session Topics

| Topic | Direction | Retained | Description |
|-------|-----------|----------|-------------|
| `melb/session/start` | pi-ctlr → all | No | Session start with UUID + start_time |
| `melb/session/stop` | pi-ctlr → all | No | Session stop command |
| `melb/session/state` | pi-ctlr → all | Yes | Current state: `idle`, `preflight`, `recording` |

## Device Topics

### Camera Nodes (picam)

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb/picam/01/cmd` | pi-ctlr → picam | Commands: `start`, `stop`, `stream` |
| `melb/picam/01/status` | picam → pi-ctlr | Status: `ready`, `recording`, `error` |
| `melb/picam/02/cmd` | pi-ctlr → picam | Commands |
| `melb/picam/02/status` | picam → pi-ctlr | Status |
| `melb/picam/03/cmd` | pi-ctlr → picam | Commands |
| `melb/picam/03/status` | picam → pi-ctlr | Status |

### Phone / Watch

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb/phone/status` | phone → pi-ctlr | Connection status |
| `melb/phone/sensor` | phone → pi-ctlr | Sensor data stream |
| `melb/watch/status` | watch → pi-ctlr | Connection status |
| `melb/watch/sensor` | watch → pi-ctlr | Sensor data stream |

### Onboard Sensors (pi-ctlr)

| Topic | Direction | Description |
|-------|-----------|-------------|
| `melb/sensor/can` | internal | CAN bus data |
| `melb/sensor/imu` | internal | IMU data |
| `melb/sensor/gnss` | internal | GPS/GNSS data |

## QoS Levels

| Message Type | QoS | Rationale |
|--------------|-----|-----------|
| Commands | 1 | Must be delivered |
| Status | 1 | Important for state sync |
| Sensor data | 0 | High volume, loss acceptable |

## Message Payloads

### session/start
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "start_time": 1679900000
}
```

### picam/status
```json
{
  "state": "recording",
  "disk_free_mb": 12400,
  "temp_c": 52
}
```

### phone/sensor
```json
{
  "ts": 1679900123456,
  "accel": [0.01, -0.02, 9.81],
  "gyro": [0.001, 0.002, -0.001]
}
```
