# DevOps & Infrastructure

## Requirements

### pi-ctlr

```bash
sudo apt install mosquitto mosquitto-clients rsync python3 python3-pip
pip install fastapi uvicorn paho-mqtt psutil python-dotenv pydantic-settings
```

### Camera Node

```bash
sudo apt install rpicam-apps rsync python3 python3-pip
pip install paho-mqtt psutil python-dotenv
```

---

## Configuration

### Controller (.env)

```bash
# MQTT
MQTT_BROKER=localhost
MQTT_PORT=1883
MQTT_TOPIC_PREFIX=ctlr

# API
API_HOST=0.0.0.0
API_PORT=8000

# Timing
TELEMETRY_INTERVAL=2
PREFLIGHT_TIMEOUT=30
```

| Variable | Default | Description |
|----------|---------|-------------|
| `MQTT_BROKER` | localhost | MQTT broker hostname |
| `MQTT_PORT` | 1883 | MQTT broker port |
| `MQTT_TOPIC_PREFIX` | ctlr | Prefix for all MQTT topics |
| `API_HOST` | 0.0.0.0 | API server bind address |
| `API_PORT` | 8000 | API server port |
| `TELEMETRY_INTERVAL` | 2 | Seconds between telemetry updates |
| `PREFLIGHT_TIMEOUT` | 30 | Max seconds to wait for node confirmations |

### Camera Node (.env)

```bash
# Identity
NODE_ID=cam-01
NODE_NAME=Front Camera

# MQTT
MQTT_BROKER=pi-ctlr
MQTT_PORT=1883
MQTT_TOPIC_PREFIX=ctlr

# Preflight Checks
PREFLIGHT_DISK_MIN_MB=1024
PREFLIGHT_CAMERA_DEVICE=/dev/video0
PREFLIGHT_STORAGE_PATH=/mnt/recordings

# Recording
RECORDING_DISK_STOP_MB=500
RECORDING_FPS=30
RECORDING_RESOLUTION=1920x1080

# Health Reporting
HEALTH_INTERVAL_SECS=5
STATUS_INTERVAL_SECS=30
```

---

## Preflight Checks

Run on each camera node before recording:

| Check | Config | Default | Fail Action |
|-------|--------|---------|-------------|
| Disk space | `PREFLIGHT_DISK_MIN_MB` | 1024 | Reject |
| Camera accessible | `PREFLIGHT_CAMERA_DEVICE` | /dev/video0 | Reject |
| Storage writable | `PREFLIGHT_STORAGE_PATH` | /mnt/recordings | Reject |

## Recording Safeguards

| Check | Config | Default | Action |
|-------|--------|---------|--------|
| Disk low | `RECORDING_DISK_STOP_MB` | 500 | Stop, finalize file |

---

## Error Handling

- **Isolated failures**: Node errors do not affect other nodes
- **On fatal error**: Stop recording → finalize file → publish error → return to ready
- **Controller tracks**: Which nodes are healthy vs failed per session

---

## Project Structure

### Controller

```
ctlr-core/
├── .env
└── server/
    ├── config.py           # Settings loader
    ├── state.py            # Thread-safe shared state
    ├── session_manager.py  # State machine
    ├── mqtt_client.py      # MQTT pub/sub
    ├── telemetry.py        # System metrics
    ├── api.py              # FastAPI endpoints
    └── main.py             # Entry point
```

### Camera Node

```
cam-node/
├── .env
└── src/
    ├── config.py           # Settings loader
    ├── state.py            # Node state machine
    ├── mqtt_client.py      # MQTT pub/sub
    ├── camera.py           # Recording control
    ├── preflight.py        # Health checks
    └── main.py             # Entry point
```

---

## Testing Locally

```bash
# Terminal 1: Monitor MQTT
mosquitto_sub -t "ctlr/#" -v

# Terminal 2: Start controller
cd ctlr-core/server && python main.py

# Terminal 3: Test API
curl http://localhost:8000/state
curl -X POST http://localhost:8000/preflight \
  -H "Content-Type: application/json" \
  -d '{"start_in": 10, "nodes": ["cam-01"]}'

# Terminal 4: Simulate node ready
mosquitto_pub -t "ctlr/node/cam-01/ready" \
  -m '{"node_id": "cam-01", "ready": true}'
```
