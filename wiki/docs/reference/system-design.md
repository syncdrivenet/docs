# System Design

## Overview

Multi-device recording system coordinated by a Pi controller. All devices record synchronously under a shared session UUID.

## Network

```mermaid
graph TD
    Router[Router / WiFi AP]

    Router --- PiCtlr[pi-ctlr]
    Router --- PiCam1[picam-01]
    Router --- PiCam2[picam-02]
    Router --- PiCam3[picam-03]
    Router --- Phone[iPhone]
    Router --- Watch[Apple Watch]
```

All devices connect via WiFi to a local router. The `pi-ctlr` runs the Mosquitto MQTT broker. Remote access via **Tailscale VPN**.

## Devices

| ID | Hardware | Role |
|----|----------|------|
| `pi-ctlr` | Pi 4 | Session authority, MQTT broker, data aggregation |
| `picam-01` | Pi Zero 2 | 1080p video, 360p live stream |
| `picam-02` | Pi Zero 2 | 1080p video, 360p live stream |
| `picam-03` | Pi Zero 2 | 1080p video, 360p live stream |
| `phone` | iPhone | Sensor recording, user UI |
| `watch` | Apple Watch | Sensor recording, user UI |
| `sensor` | Pi 4 onboard | CAN, GNSS, IMU |

## Session Lifecycle

```
idle → preflight → recording → idle
```

1. **Start** — User taps start on phone/watch
2. **Preflight** — pi-ctlr generates UUID, all devices confirm ready
3. **Recording** — pi-ctlr sends `session/start` with `start_time` (+5s buffer)
4. **Stop** — All devices stop, pi-ctlr triggers rsync + upload

### Crash Recovery

Retained topics `session/state` and `session/last` allow devices to rejoin an active session on reconnect.

## Storage

| Device | Format | Notes |
|--------|--------|-------|
| `picam-*` | MP4 H.264, 30-60s snippets | rsync to pi-ctlr, delete on success |
| `phone` / `watch` | SQLite | `timestamp, recording_id, sensor_type, value` |
| `sensor` | SQLite or CSV | Same schema |
| `pi-ctlr` | Folder per `recording_id` | Aggregates all video + sensor DBs |
