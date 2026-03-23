# System Design

## Overview

Multi-device recording system coordinated by a Pi 4 controller. All devices record synchronously under a shared session UUID.

## Devices

| ID | Role |
|----|------|
| `ctlr` | Pi 4 — session authority, data aggregation |
| `cam-01` | Pi Zero 2 — 1080p video, 360p live stream |
| `phone-01` | iPhone — sensor recording, user UI |
| `watch-01` | Apple Watch — sensor recording, user UI |
| `sensor-01` | Pi 4 onboard — CAN, GNSS, IMU |

## Network

All devices connect via **Tailscale VPN**. The Pi 4 runs the Mosquitto MQTT broker.

## Session Lifecycle

```
idle → preflight → recording → idle
```

1. **Start** — User taps start on phone/watch
2. **Preflight** — Pi 4 generates UUID, all devices confirm ready
3. **Recording** — Pi 4 sends `session/start` with `start_time` (+5s buffer)
4. **Stop** — All devices stop, Pi 4 triggers rsync + upload

### Crash Recovery

Retained topics `session/state` and `session/last` allow devices to rejoin an active session on reconnect.

## Storage

| Device | Format | Notes |
|--------|--------|-------|
| `cam-01` | MP4 H.264, 30-60s snippets | rsync to Pi 4, delete on success |
| `phone-01` / `watch-01` | SQLite | `timestamp, recording_id, sensor_type, value` |
| `sensor-01` | SQLite or CSV | Same schema |
| Pi 4 | Folder per `recording_id` | Aggregates all video + sensor DBs |

### Rsync Command

```bash
rsync -av --remove-source-files /home/pi/trips/ pi4:/mnt/trips/
```
