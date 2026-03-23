# DevOps & Infrastructure

## Requirements

### pi-ctlr

| Package | Purpose |
|---------|---------|
| `mosquitto` | MQTT broker |
| `mosquitto-clients` | CLI tools (pub/sub) |
| `rsync` | Receive files from picam |
| `python3` | Session manager |

```bash
sudo apt install mosquitto mosquitto-clients rsync python3
```

### picam node

| Package | Purpose |
|---------|---------|
| `rpicam-vid` | Camera recording |
| `rsync` | Sync to pi-ctlr |
| `python3` | Node agent |
| `paho-mqtt` | MQTT client |

```bash
sudo apt install rpicam-apps rsync python3 python3-pip
pip3 install paho-mqtt
```
