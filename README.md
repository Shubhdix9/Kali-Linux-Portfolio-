# 🐉 CyberSentinel OS: Kali Linux Portfolio Workspace

A premium, interactive web-based operating system simulating a Kali Linux desktop environment (XFCE). This project serves as a highly engaging personal portfolio and interactive workspace for **Shubh Dixit**, an AI Research Scholar and Cybersecurity Specialist.

Built using **Next.js 16 (App Router)**, **Framer Motion**, and **Tailwind CSS**, it features a fully-functional multi-window desktop manager, simulated cybersecurity labs, diagnostic monitors, and an interactive shell interface.

---

## 🚀 Key Features

### 🖥️ 1. Authentic Boot & Authentication
* **BIOS & Kernel Boot Diagnostics**: Interactive console log simulation booting services, verifying hashes, mounting volumes, and checking security firewall logs. Can be bypassed instantly via the `BYPASS KERNEL` button.
* **Biometric Authentication Portal**: Face scanning animation scanner and pin credential prompt screen. Features a `BIOMETRIC FACIAL SCAN` button (which simulates a biometric scan overlay and automatically unlocks on match) and an `Unlock` button to bypass credential input.

### 🎛️ 2. Desktop Environment (XFCE Style)
* **Draggable Window Manager**: Multi-window support with individual stacking order (`z-index`) depth focus, snapping boundaries, window maximize/minimize, and clean drag-drop physics.
* **Live System metrics panel**: Real-time graphs styled as XFCE taskbar plugins displaying CPU and RAM usage charts. Collapses on mobile to show space-saving compact readouts.
* **Quick Access Icons**: Desktop links launching core modules, viewing local repositories, PDF resume downloads, and connecting to GitHub/LinkedIn/LeetCode socials. Configured as a responsive wrapped grid on mobile screens.
* **Active App Dock / Switcher (New)**: Persistent status tray in the bottom footer listing open apps. Tapping a dock icon toggles the app's focus, minimizes it, or restores it (mimicking real LightDM/XFCE window behavior).
* **Top-Left Application Menu (New)**: Tapping "KALI LINUX" in the top bar launches a dropdown menu to run any app directly.

### 🛠️ 3. Embedded Application Suites
* **Root Terminal (CLI Shell)**: Functional terminal emulator containing autocomplete suggestions, shell command history, and interactive scripts. Supported commands include `help`, `about`, `skills`, `projects`, `clear`, `socials`, `scan network`, `show threat-intel`, `open browser`, etc. Features a **Quick CLI Shortcut Bar** and **tap-to-autocomplete suggestion buttons** to enable a fully touch-friendly, keyboard-free terminal experience on mobile viewports.
* **SOC Cyber Lab**: Simulated target vulnerability intrusion interface showcasing web security tests, log monitoring, and target assessment vectors. Fits nicely on mobile viewports with row-wrapping.
* **Global Threat Map**: Visual network radar and attack map overlay showing geographical server load and threat locations. Stacks vertically on mobile with a grid layout for metrics.
* **Metasploit Console (MSF)**: Specialized sub-terminal simulating target scans, exploit injections, payload deployments, and terminal session shells. Includes a **Quick MSF action bar** to easily trigger scanning and exploit payloads without typing.
* **Welcome Portfolio Browser**: Embedded sleek viewer mapping education profiles (IIT Ropar, IIT Kanpur, IIIT Delhi, JKLU) and honors.

---

## 🛠️ Technology Stack

* **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router & React 19)
* **CSS & Design**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Developer Environment**: Turbopack & TypeScript

---

## ⚙️ Getting Started

Follow these steps to run the workspace locally on your system.

### Prerequisites
Make sure you have Node.js (version 18 or higher) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shubhdix9/cyber-sentinel-os.git
   cd cyber-sentinel-os
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   * [http://localhost:3000](http://localhost:3000)

---

## 📁 Repository Structure

```
cyber-sentinel-os/
├── public/               # Static assets (logos, background images, PDFs)
├── src/
│   ├── app/
│   │   ├── layout.tsx    # App entry layout setup (styles, fonts)
│   │   ├── page.tsx      # Main workspace component (Desktop, terminal, modules)
│   │   └── globals.css   # Main styles, theme variables, glassmorphism config
```

---

## 📄 License

This project is licensed under the MIT License. Feel free to use and adapt this system to build your own custom developer dashboard.
