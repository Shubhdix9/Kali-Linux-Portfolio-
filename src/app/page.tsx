"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal as TermIcon,
  User,
  Cpu,
  Layers,
  Shield,
  FileText,
  Send,
  RefreshCw,
  Play,
  Search,
  Code,
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  Maximize2,
  Minimize2,
  X,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Eye,
  Server,
  Globe,
  Wifi,
  Zap,
  Activity,
  Target
} from "lucide-react";

// ==========================================
// 1. MATRIX RAIN EFFECT COMPONENT
// ==========================================
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const characters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@$&*";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Alternate colors between green and cyan
        ctx.fillStyle = i % 4 === 0 ? "#00D4FF" : "#00FF88";
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
}

// ==========================================
// 2. WINDOW FRAME COMPONENT
// ==========================================
interface WindowFrameProps {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  children: React.ReactNode;
}

function WindowFrame({
  title,
  icon,
  isOpen,
  onClose,
  onFocus,
  zIndex,
  initialX = 160,
  initialY = 80,
  initialWidth = 720,
  initialHeight = 520,
  children
}: WindowFrameProps) {
  const [maximized, setMaximized] = useState(false);
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const dragStart = useRef({ x: 0, y: 0 });
  const windowStart = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Auto-maximize on mobile screens
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setMaximized(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (maximized) return;
    
    // Do not initiate dragging on buttons or interactive links
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("input")) return;

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    windowStart.current = { x: pos.x, y: pos.y };
    onFocus();
    
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || maximized) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    let newX = windowStart.current.x + dx;
    let newY = windowStart.current.y + dy;
    
    // Constrain within viewport boundaries
    if (typeof window !== "undefined") {
      newX = Math.max(-size.width + 120, Math.min(newX, window.innerWidth - 120));
      newY = Math.max(0, Math.min(newY, window.innerHeight - 80));
    }
    
    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.18 }}
      onMouseDown={onFocus}
      style={{
        zIndex,
        position: "absolute",
        left: maximized ? 0 : pos.x,
        top: maximized ? 44 : pos.y,
        width: maximized ? "100vw" : size.width,
        height: maximized ? "calc(100vh - 84px)" : size.height,
      }}
      className="glassmorphism rounded-lg flex flex-col overflow-hidden shadow-2xl border border-white/10 select-none glow-secondary/5"
    >
      {/* Title Bar */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="win-title h-12 bg-black/85 flex items-center justify-between px-4 border-b border-white/10 cursor-move relative touch-none"
      >
        {/* Left: Window Icon & Title */}
        <div className="flex items-center gap-2.5 z-10 pointer-events-none">
          {icon && <span className="text-[#00BCD4] flex items-center">{icon}</span>}
          <span className="font-mono text-xs md:text-sm text-white/90 font-bold tracking-wider">
            {title}
          </span>
        </div>
        
        {/* Right: Controls */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setMaximized(!maximized)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors flex items-center justify-center cursor-pointer"
            title={maximized ? "Restore Down" : "Maximize"}
          >
            {maximized ? <Minimize2 size={14} className="text-[#00BCD4]" /> : <Maximize2 size={14} className="text-[#00BCD4]" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-danger/25 rounded transition-colors flex items-center justify-center cursor-pointer"
            title="Close"
          >
            <X size={14} className="text-danger" />
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-auto bg-[#121212]/75 text-[#E2E8F0] p-4 font-sans relative">
        {children}
      </div>
    </motion.div>
  );
}

// AI Research Lab component removed

// ==========================================
// 4. CYBERSECURITY LAB COMPONENT
// ==========================================
interface Packet {
  time: string;
  src: string;
  dest: string;
  protocol: string;
  info: string;
  status: "SAFE" | "ATTACK";
}

function CyberLab() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanOutput, setScanOutput] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocols = ["TCP/80", "UDP/53", "SSH/22", "HTTP/443", "ICMP", "SMB/445"];
    const ips = ["192.168.1.10", "10.0.4.99", "172.16.8.22", "45.88.109.112", "192.168.1.1"];
    const infos = [
      "Syn connection initialized",
      "DNS Request query",
      "Authentication request failed",
      "TLSv1.3 cryptographic handshake",
      "Echo request ping",
      "Suspicious payload injection attempt"
    ];

    const interval = setInterval(() => {
      const isAttack = Math.random() > 0.8;
      const newPacket: Packet = {
        time: new Date().toLocaleTimeString(),
        src: ips[Math.floor(Math.random() * ips.length)],
        dest: "192.168.1.109",
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        info: isAttack ? "SMB brute force signature matching (CVE-2020-0796)" : infos[Math.floor(Math.random() * infos.length)],
        status: isAttack ? "ATTACK" : "SAFE",
      };
      setPackets(prev => [newPacket, ...prev.slice(0, 15)]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const triggerScan = () => {
    setScanning(true);
    setScanOutput(["[+] Initializing Nmap engine v7.93...", "[+] Performing ping sweep..."]);
    
    setTimeout(() => {
      setScanOutput(o => [...o, "[+] Target 192.168.1.109 is online.", "[+] Scanning 1000 standard ports..."]);
    }, 1000);

    setTimeout(() => {
      setScanOutput(o => [...o,
        "PORT     STATE  SERVICE",
        "22/tcp   open   ssh",
        "80/tcp   open   http",
        "443/tcp  open   https",
        "8888/tcp open   flask-api",
        "[+] Vulnerability checks active: checking SMB/445... SAFE.",
        "[+] Threat matrix assessment completed successfully."
      ]);
      setScanning(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nmap Terminal */}
        <div className="border border-white/10 p-4 bg-black/70 rounded-lg flex flex-col h-64 justify-between">
          <div className="space-y-2 overflow-y-auto max-h-48 pr-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-secondary font-bold">PORT ROUTER SCANNER</span>
              <button
                onClick={triggerScan}
                disabled={scanning}
                className="px-2.5 py-1 bg-secondary/20 hover:bg-secondary/30 border border-secondary/40 text-secondary rounded flex items-center gap-1 disabled:opacity-50"
              >
                <Search size={12} /> {scanning ? "RUNNING..." : "SCAN NETWORK"}
              </button>
            </div>
            {scanOutput.map((l, idx) => (
              <div key={idx} className={l.startsWith("[+]") ? "text-primary" : "text-white/80"}>
                {l}
              </div>
            ))}
          </div>
          <div className="text-[10px] opacity-40 text-right">Kali Linux Netscan Module</div>
        </div>

        {/* Live Attack map log */}
        <div className="border border-white/10 p-4 bg-black/70 rounded-lg flex flex-col h-64 justify-between">
          <div className="border-b border-white/10 pb-2 mb-2 flex justify-between items-center">
            <span className="text-danger font-bold flex items-center gap-1">
              <Shield size={12} className="animate-pulse text-danger" /> SOC WIRESHARK INTRUSION
            </span>
            <span className="text-[10px] bg-danger/10 border border-danger/30 text-danger px-1.5 rounded">MONITORING</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-2">
            {packets.map((p, idx) => (
              <div
                key={idx}
                className={`p-1.5 border rounded flex justify-between gap-2 items-center ${
                  p.status === "ATTACK" ? "bg-danger/10 border-danger/40 text-danger font-bold" : "bg-white/5 border-white/5 text-white/80"
                }`}
              >
                <span>{p.time}</span>
                <span>{p.src}</span>
                <span className="text-secondary">{p.protocol}</span>
                <span className="truncate max-w-[150px]">{p.info}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-white/10 p-4 bg-black/40 rounded-lg">
        <h4 className="text-secondary font-bold mb-1">MALWARE & static ANALYSIS LAB</h4>
        <p className="text-[#E2E8F0]/70 leading-relaxed">
          This system models machine learning-based signature detection. Features are extracted dynamically and analyzed through XGBoost networks to flag system injections, Trojan loads, and payload deliveries before execution.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 5. PROJECTS APPLICATION COMPONENT
// ==========================================
interface Project {
  id: number;
  title: string;
  desc: string;
  tech: string;
  features: string[];
}

function ProjectsApp() {
  const projectsList: Project[] = [
    {
      id: 1,
      title: "AI Breast Cancer Detection System",
      tech: "YOLOv8, Python, OpenCV, Flask, Web Deployment",
      desc: "Developed a diagnostic platform that processes mammogram scans using trained convolutional neural networks to segment and categorize tumors.",
      features: [
        "Achieved F1 metric ~ 0.98",
        "Trained on custom annotated medical imaging dataset",
        "Deployed clean Flask inference platform"
      ]
    },
    {
      id: 2,
      title: "CSI Feedback Compression with Transformers",
      tech: "PyTorch, Deep Learning, Transformer Attention, Wireless",
      desc: "Investigated replacing classical LSTM feedback paths with multi-head self-attention networks to speed up CSI matrix reconstruction in MIMO arrays.",
      features: [
        "Eliminated sequential bottlenecks of RNN structures",
        "Lowered latency constraints by 30-40ms",
        "Enhanced signal reception accuracy in high-noise channels"
      ]
    },
    {
      id: 3,
      title: "Machine Learning Malware Classifier",
      tech: "Python, Scikit-Learn, XGBoost, Feature Extraction",
      desc: "Built a pipeline designed to parser file structures, extract bytecode attributes, and predict malware files with high classification precision.",
      features: [
        "Implemented PE header field inspection module",
        "Integrated XGBoost ensemble logic with accuracy exceeding 97.4%",
        "Designed a simulated SOC threat matrix log dashboard"
      ]
    },
    {
      id: 4,
      title: "Virtual Hand Tracking Guitar Interface",
      tech: "YOLOv8, OpenCV, MediaPipe, Python Audio Library",
      desc: "Created an interactive workspace using computer vision camera feeds to track hands, detect finger coordinates, and map movements to musical notes.",
      features: [
        "Zero-latency real-time hand skeleton rendering",
        "Finger distance calculations triggering coordinate notes",
        "Dynamic sound library loading framework"
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projectsList.map(p => (
        <div key={p.id} className="border border-white/10 p-4 bg-black/40 rounded-lg flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <span className="text-secondary text-[10px] tracking-wider uppercase font-mono">{p.tech}</span>
            <h3 className="text-sm font-bold text-[#E2E8F0]">{p.title}</h3>
            <p className="text-xs text-[#E2E8F0]/70 leading-relaxed">{p.desc}</p>
            <ul className="text-[11px] text-primary/95 space-y-1 font-mono">
              {p.features.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href="https://github.com/Shubhdix9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 rounded text-xs transition-colors flex items-center gap-1.5 font-mono"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> Source Code
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 8. BROWSER WELCOME COMPONENT
// ==========================================

// ==========================================
// NEW: GLOBAL THREAT MAP COMPONENT
// ==========================================
interface LiveAttack {
  id: number;
  src: string;
  dst: string;
  type: string;
  severity: "LOW" | "MED" | "HIGH" | "CRIT";
  time: string;
}

function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [liveAttacks, setLiveAttacks] = useState<LiveAttack[]>([]);
  const [stats, setStats] = useState({ total: 14847, blocked: 14201, active: 12, critical: 3 });
  const attackIdRef = useRef(0);

  // City nodes with approximate mercator x/y (0-1 normalized)
  const CITIES = [
    { name: "New York",    x: 0.215, y: 0.34 },
    { name: "London",      x: 0.468, y: 0.245 },
    { name: "Moscow",      x: 0.562, y: 0.215 },
    { name: "Beijing",     x: 0.736, y: 0.295 },
    { name: "Tokyo",       x: 0.808, y: 0.305 },
    { name: "Sydney",      x: 0.825, y: 0.67  },
    { name: "Sao Paulo",   x: 0.282, y: 0.63  },
    { name: "Mumbai",      x: 0.651, y: 0.415 },
    { name: "Dubai",       x: 0.608, y: 0.395 },
    { name: "Singapore",   x: 0.748, y: 0.49  },
    { name: "Berlin",      x: 0.495, y: 0.245 },
    { name: "Lagos",       x: 0.476, y: 0.478 },
    { name: "Seoul",       x: 0.793, y: 0.29  },
    { name: "Mexico City", x: 0.188, y: 0.415 },
    { name: "Cairo",       x: 0.547, y: 0.38  },
  ];

  const ATTACK_TYPES = ["DDoS", "SQL Inj", "XSS", "RCE", "Brute Force", "Port Scan", "Phishing", "0-day"];
  const SEVERITIES: Array<"LOW" | "MED" | "HIGH" | "CRIT"> = ["LOW", "MED", "HIGH", "CRIT"];
  const SEV_COLORS: Record<string, string> = { LOW: "#4CAF50", MED: "#FFB800", HIGH: "#FF7043", CRIT: "#FF4D4D" };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const arcs: { sx: number; sy: number; ex: number; ey: number; progress: number; color: string; speed: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const loop = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#050a0e";
      ctx.fillRect(0, 0, W, H);

      // Grid lines (lat/lon simulation)
      ctx.strokeStyle = "rgba(0,188,212,0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 12; i++) {
        const x = (i / 12) * W;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let j = 0; j <= 8; j++) {
        const y = (j / 8) * H;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Equator line
      ctx.strokeStyle = "rgba(0,188,212,0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, H * 0.5); ctx.lineTo(W, H * 0.5); ctx.stroke();
      ctx.setLineDash([]);

      // Spawn new arc every ~90 frames
      if (frame % 90 === 0 && CITIES.length > 1) {
        const srcIdx = Math.floor(Math.random() * CITIES.length);
        let dstIdx = Math.floor(Math.random() * CITIES.length);
        while (dstIdx === srcIdx) dstIdx = Math.floor(Math.random() * CITIES.length);
        const isCrit = Math.random() > 0.8;
        const color = isCrit ? "#FF4D4D" : Math.random() > 0.5 ? "#00BCD4" : "#FFB800";
        arcs.push({
          sx: CITIES[srcIdx].x * W,
          sy: CITIES[srcIdx].y * H,
          ex: CITIES[dstIdx].x * W,
          ey: CITIES[dstIdx].y * H,
          progress: 0,
          color,
          speed: 0.004 + Math.random() * 0.006,
        });
      }

      // Draw and advance arcs
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.progress += arc.speed;
        if (arc.progress > 1) { arcs.splice(i, 1); continue; }

        const cp = { x: (arc.sx + arc.ex) / 2, y: Math.min(arc.sy, arc.ey) - 60 };
        const t = arc.progress;
        const px = (1-t)*(1-t)*arc.sx + 2*(1-t)*t*cp.x + t*t*arc.ex;
        const py = (1-t)*(1-t)*arc.sy + 2*(1-t)*t*cp.y + t*t*arc.ey;

        // Draw bezier trail
        ctx.beginPath();
        ctx.moveTo(arc.sx, arc.sy);
        ctx.quadraticCurveTo(cp.x, cp.y, px, py);
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Draw moving dot
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = arc.color;
        ctx.shadowColor = arc.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw city nodes
      CITIES.forEach(city => {
        const cx = city.x * W;
        const cy = city.y * H;
        // Pulse ring
        const pulse = (Math.sin(frame * 0.05) * 0.5 + 0.5);
        ctx.beginPath();
        ctx.arc(cx, cy, 6 + pulse * 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,188,212,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
        // Core dot
        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#00BCD4";
        ctx.shadowColor = "#00BCD4";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Label
        ctx.font = "9px monospace";
        ctx.fillStyle = "rgba(0,188,212,0.8)";
        ctx.fillText(city.name, cx + 6, cy - 4);
      });

      frame++;
      raf = requestAnimationFrame(loop);
    };

    let raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Generate live attack log entries
  useEffect(() => {
    const interval = setInterval(() => {
      const src = CITIES[Math.floor(Math.random() * CITIES.length)];
      const dst = CITIES[Math.floor(Math.random() * CITIES.length)];
      const sev = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
      const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
      const newAttack: LiveAttack = {
        id: attackIdRef.current++,
        src: src.name,
        dst: dst.name,
        type,
        severity: sev,
        time: new Date().toLocaleTimeString(),
      };
      setLiveAttacks(prev => [newAttack, ...prev.slice(0, 10)]);
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        blocked: prev.blocked + (Math.random() > 0.15 ? 1 : 0),
        active: Math.floor(Math.random() * 20) + 8,
        critical: Math.floor(Math.random() * 6) + 1,
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const sevColor: Record<string, string> = { LOW: "text-green-400", MED: "text-yellow-400", HIGH: "text-orange-400", CRIT: "text-red-400" };

  return (
    <div className="flex h-full gap-4 font-mono text-xs">
      {/* World Map Canvas */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Stats bar */}
        <div className="flex gap-3">
          {[
            { label: "TOTAL ATTACKS", val: stats.total.toLocaleString(), color: "text-[#00BCD4]" },
            { label: "BLOCKED", val: stats.blocked.toLocaleString(), color: "text-green-400" },
            { label: "ACTIVE", val: stats.active, color: "text-yellow-400" },
            { label: "CRITICAL", val: stats.critical, color: "text-red-400" },
          ].map(s => (
            <div key={s.label} className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-center">
              <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[9px] text-white/40 tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
        {/* Canvas */}
        <div className="flex-1 rounded border border-[#00BCD4]/20 overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute top-2 left-2 text-[9px] text-[#00BCD4]/50 font-mono tracking-widest">GLOBAL THREAT INTELLIGENCE MAP — LIVE</div>
        </div>
      </div>

      {/* Live Attack Feed */}
      <div className="w-52 flex flex-col gap-2">
        <div className="text-[#00BCD4] font-bold tracking-widest text-[10px] flex items-center gap-1">
          <Activity size={10} className="animate-pulse" /> LIVE THREAT FEED
        </div>
        <div className="flex-1 overflow-y-auto space-y-1.5">
          {liveAttacks.map(atk => (
            <div key={atk.id} className={`p-1.5 rounded border text-[10px] ${
              atk.severity === "CRIT" ? "border-red-500/40 bg-red-500/5" :
              atk.severity === "HIGH" ? "border-orange-500/40 bg-orange-500/5" :
              "border-white/10 bg-white/5"
            }`}>
              <div className="flex justify-between items-center">
                <span className={`font-bold ${sevColor[atk.severity]}`}>[{atk.severity}]</span>
                <span className="text-white/30">{atk.time}</span>
              </div>
              <div className="text-white/70 truncate">{atk.type}</div>
              <div className="text-white/40 text-[9px] truncate">{atk.src} → {atk.dst}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-2 space-y-1 text-[9px] text-white/40">
          <div className="flex justify-between"><span>Kali ThreatFeed v2.1</span><span className="text-green-400 animate-pulse">● LIVE</span></div>
          <div>API: threat.intel/v2/stream</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// NEW: MSF CONSOLE COMPONENT
// ==========================================
const MSF_BANNER = `
       =[ metasploit v6.3.44-dev-kali ]
+ -- --=[ 2358 exploits - 1233 auxiliary - 412 post ]
+ -- --=[ 1375 payloads - 46 encoders - 11 nops     ]
+ -- --=[ 9 evasion modules                          ]

msf6 > `;

const MSF_MODULES: Record<string, string> = {
  "exploit/multi/handler": "Generic Payload Handler",
  "exploit/windows/smb/ms17_010_eternalblue": "MS17-010 EternalBlue SMB RCE [CVE-2017-0144]",
  "exploit/unix/ftp/vsftpd_234_backdoor": "VSFTPD v2.3.4 Backdoor [CVE-2011-2523]",
  "auxiliary/scanner/portscan/tcp": "TCP Port Scanner",
  "auxiliary/scanner/smb/smb_ms17_010": "SMB MS17-010 Vulnerability Check",
  "post/linux/gather/hashdump": "Linux Gather Dump Password Hashes",
};

function MSFConsole() {
  const [history, setHistory] = useState<string[]>([MSF_BANNER]);
  const [input, setInput] = useState("");
  const [module, setModule] = useState<string | null>(null);
  const [rhosts, setRhosts] = useState("");
  const [lport, setLport] = useState("4444");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [history]);

  const prompt = module ? `msf6 ${module.split("/").pop()}(${module.split("/")[1] ?? ""}) > ` : "msf6 > ";

  const handleMSF = (cmd: string) => {
    const c = cmd.trim().toLowerCase();
    let out = "";

    if (c === "help") {
      out = `Core Commands
=============
  Command     Description
  -------     -----------
  exit        Exit the console
  help        Help menu
  info        Displays module information
  search      Searches module names
  sessions    Display sessions
  show        Displays modules
  use         Selects a module by name
  set         Sets a context-specific variable
  run/exploit Execute module`;
    } else if (c.startsWith("search")) {
      const term = cmd.slice(7).trim();
      out = `Matching Modules\n================\n`;
      Object.entries(MSF_MODULES).forEach(([path, desc]) => {
        if (!term || path.includes(term.toLowerCase()) || desc.toLowerCase().includes(term.toLowerCase())) {
          out += `  ${path.padEnd(55)} ${desc}\n`;
        }
      });
    } else if (c.startsWith("use ")) {
      const mod = cmd.slice(4).trim();
      const found = Object.keys(MSF_MODULES).find(k => k.includes(mod) || k === mod);
      if (found) {
        setModule(found);
        out = `[*] No payload configured, defaulting to ${found.includes("windows") ? "windows/x64/meterpreter/reverse_tcp" : "linux/x86/meterpreter/reverse_tcp"}\n`;
      } else {
        out = `[-] Failed to load module: ${mod}`;
      }
    } else if (c === "show options" || c === "options") {
      if (!module) { out = "[-] No module selected. Use 'use <module>' first."; }
      else {
        out = `Module options (${module}):\n\n   Name    Current Setting  Required  Description\n   ----    ---------------  --------  -----------\n   RHOSTS  ${rhosts.padEnd(15)}  yes       Target host\n   LPORT   ${lport.padEnd(15)}  yes       Listen port`;
      }
    } else if (c.startsWith("set rhosts")) {
      const val = cmd.slice(10).trim();
      setRhosts(val);
      out = `RHOSTS => ${val}`;
    } else if (c.startsWith("set lport")) {
      const val = cmd.slice(9).trim();
      setLport(val);
      out = `LPORT => ${val}`;
    } else if (c === "sessions" || c === "sessions -l") {
      out = `Active sessions\n===============\n  Id  Name  Type                 Info             Connection\n  --  ----  ----                 ----             ----------\n   1        meterpreter x86/linux  root @ target   192.168.1.${Math.floor(Math.random()*255)} -> ${rhosts || "192.168.1.109"}:${lport}`;
    } else if (c === "info") {
      out = module ? `Name: ${MSF_MODULES[module] ?? module}\nModule: ${module}\nPlatform: Multi\nRank: Excellent` : "[-] No module loaded.";
    } else if (c === "run" || c === "exploit") {
      if (!module) { out = "[-] No module selected."; }
      else if (!rhosts) { out = "[-] RHOSTS not set. Use: set RHOSTS <target>"; }
      else {
        out = `[*] Started reverse TCP handler on 0.0.0.0:${lport}\n[*] Sending exploit payload to ${rhosts}:445 ...\n[*] Meterpreter session 1 opened (192.168.1.1:${lport} -> ${rhosts}:4444)\n\n[+] Shell stabilized. meterpreter >`;
      }
    } else if (c === "exit" || c === "quit") {
      out = "Closing console...";
    } else if (c === "") {
      out = "";
    } else {
      out = `[-] Unknown command: ${cmd}. Type 'help' for help.`;
    }

    setHistory(prev => [...prev, `${prompt}${cmd}`, out]);
    setInput("");
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full h-full flex flex-col cursor-text"
      style={{ backgroundColor: "#0a0a0a", fontFamily: "monospace" }}
    >
      <div ref={containerRef} className="flex-1 overflow-y-auto p-3 text-xs space-y-1">
        {history.map((line, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap leading-relaxed"
            style={{
              color: line.startsWith("msf6") ? "#e0e0e0" :
                     line.startsWith("[+]") ? "#4CAF50" :
                     line.startsWith("[*]") ? "#00BCD4" :
                     line.startsWith("[-]") ? "#FF4D4D" :
                     line.startsWith("[!]") ? "#FFB800" :
                     "#aaaaaa"
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 px-3 py-2 border-t border-white/10">
        <span className="text-[#4CAF50] text-xs font-bold whitespace-nowrap">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          autoFocus
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleMSF(input); }}
          className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

// ==========================================
// 8. BROWSER WELCOME COMPONENT
// ==========================================
function BrowserApp() {
  return (
    <div className="flex flex-col space-y-6 text-slate-200 font-sans p-2">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-center gap-5 border-b border-white/10 pb-6">
        <img
          src="/shubhdixit.png"
          alt="Shubh Dixit"
          className="w-24 h-24 rounded-full object-cover border border-[#00BCD4] shadow-lg shadow-[#00BCD4]/20"
        />
        <div className="text-center md:text-left space-y-1.5">
          <h2 className="text-3xl font-extrabold text-white tracking-wide font-mono">SHUBH DIXIT</h2>
          <p className="text-sm font-semibold text-[#00BCD4]">
            AI Research Intern • Cybersecurity Enthusiast • Full Stack Developer
          </p>
        </div>
      </div>

      {/* Interactive Row / Pill Navigation */}
      <div className="flex flex-wrap gap-2.5">
        <a
          href="https://github.com/Shubhdix9"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#121212] hover:bg-black/40 text-white rounded-full text-xs font-semibold border border-[#00BCD4]/30 hover:border-[#00BCD4] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#00BCD4]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.29-1.23 3.29-1.23.67 1.66.25 2.88.13 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.81 5.61-5.48 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.58A12 12 0 0012 .5z"/>
          </svg>
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/shubhdixit0912/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#121212] hover:bg-black/40 text-white rounded-full text-xs font-semibold border border-[#00BCD4]/30 hover:border-[#00BCD4] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#00BCD4]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.2 2.3-2.47 4.73-2.47 5.06 0 6 3.33 6 7.66V24h-5v-7.58c0-1.81-.03-4.14-2.52-4.14-2.52 0-2.9 1.97-2.9 4v7.72h-5V8z" />
          </svg>
          LinkedIn
        </a>
        <a
          href="https://leetcode.com/u/GhostKernel09"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#121212] hover:bg-black/40 text-white rounded-full text-xs font-semibold border border-[#00BCD4]/30 hover:border-[#00BCD4] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#00BCD4]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.102 17.93l-2.69 2.607c-.466.451-1.111.696-1.744.696a2.285 2.285 0 0 1-1.744-.696L3.666 14.3a2.435 2.435 0 0 1 0-3.437l5.568-5.399a2.285 2.285 0 0 1 1.744-.696c.632 0 1.278.245 1.744.696l2.69 2.607a.724.724 0 0 1 0 1.027.766.766 0 0 1-1.059 0l-2.69-2.607c-.19-.184-.519-.184-.709 0l-5.568 5.399a.913.913 0 0 0 0 1.283l6.257 6.256c.19.184.518.184.709 0l2.69-2.607a.766.766 0 0 1 1.059 0 .724.724 0 0 1 0 1.027zm4.232-5.467h-7.662a.747.747 0 0 1-.767-.726c0-.4.344-.726.767-.726h7.662c.423 0 .767.325.767.726a.747.747 0 0 1-.767.726zm-2.029-4.88h-3.604a.747.747 0 0 1-.767-.726c0-.4.344-.726.767-.726h3.604c.423 0 .767.325.767.726a.747.747 0 0 1-.767.726z"/>
          </svg>
          LeetCode
        </a>
        <a
          href="mailto:shubhdixi9@gmail.com"
          className="px-4 py-2 bg-[#121212] hover:bg-black/40 text-white rounded-full text-xs font-semibold border border-[#00BCD4]/30 hover:border-[#00BCD4] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#00BCD4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Email
        </a>
        <a
          href="/Shubh_Dixit_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold border border-amber-500/35 hover:border-amber-400 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <FileText size={16} className="text-amber-400" />
          Resume
        </a>
      </div>

      {/* Grid Layout Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: AI & Research */}
        <div className="p-5 bg-[#121212]/80 border border-[#00BCD4]/20 hover:border-[#00BCD4]/70 rounded-xl flex flex-col gap-3.5 transition-all hover:-translate-y-0.5 shadow-md shadow-[#00BCD4]/5">
          <div className="text-[#00BCD4] font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
            <Cpu size={16} className="text-[#00BCD4]" />
            AI & Research
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Research internships at <strong className="text-white font-semibold">IIT Ropar</strong> and <strong className="text-white font-semibold">IIT Kanpur</strong> focusing on Deep Learning and Computer Vision.
          </p>
        </div>

        {/* Card 2: Startup Founder */}
        <div className="p-5 bg-[#121212]/80 border border-[#00BCD4]/20 hover:border-[#00BCD4]/70 rounded-xl flex flex-col gap-3.5 transition-all hover:-translate-y-0.5 shadow-md shadow-[#00BCD4]/5">
          <div className="text-[#00BCD4] font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
            <Shield size={16} className="text-[#00BCD4]" />
            Startup Founder
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Founder of <strong className="text-white font-semibold">SeioPluse</strong>, building AI breast cancer detection systems using YOLOv8.
          </p>
        </div>

        {/* Card 3: Education */}
        <div className="p-5 bg-[#121212]/80 border border-[#00BCD4]/20 hover:border-[#00BCD4]/70 rounded-xl flex flex-col gap-3.5 transition-all hover:-translate-y-0.5 shadow-md shadow-[#00BCD4]/5">
          <div className="text-[#00BCD4] font-bold text-sm uppercase tracking-wider flex items-center gap-2 font-mono">
            <GraduationCap size={16} className="text-[#00BCD4]" />
            Education
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            B.Tech in Computer Science and Engineering at <strong className="text-white font-semibold">JKLU</strong>, with advanced coursework at <strong className="text-white font-semibold">IIIT Delhi</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. TERMINAL APP COMPONENT
// ==========================================
interface TerminalProps {
  onOpenApp: (app: string) => void;
}

function formatTerminalOutput(text: string): string {
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Keywords to highlight in cyan-blue
  const keywords = [
    "about", "skills", "experience", "projects", "socials",
    "scan network", "show threat-intel", "open browser", "open cyber-lab",
    "clear", "help", "resume", "whoami", "vulnscan", "cat"
  ];

  // Highlight list items: e.g. "- about             : About Shubh..."
  escaped = escaped.replace(/(- )([a-zA-Z0-9\-\s]+)(\s*:)/g, (match, p1, p2, p3) => {
    const trimmed = p2.trim();
    if (keywords.includes(trimmed)) {
      const padding = p2.slice(trimmed.length);
      return `${p1}<span class="text-[#00BCD4] font-bold font-mono">${trimmed}</span>${padding}${p3}`;
    }
    return match;
  });

  // Highlight words in backticks or single quotes with cyan
  escaped = escaped.replace(/`([^`]+)`/g, '<span class="text-[#00BCD4] font-bold font-mono">$1</span>');
  escaped = escaped.replace(/'([^']+)'/g, '\'<span class="text-[#00BCD4] font-bold font-mono">$1</span>\'');

  return escaped;
}

function TerminalApp({ onOpenApp }: TerminalProps) {
  const [history, setHistory] = useState<string[]>(["welcome", "about"]);
  const [input, setInput] = useState("");
  const [hints, setHints] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandList = [
    "about",
    "skills",
    "experience",
    "projects",
    "socials",
    "scan network",
    "show threat-intel",
    "open browser",
    "open cyber-lab",
    "open threat-map",
    "open msf",
    "nmap",
    "ifconfig",
    "netstat",
    "ping",
    "traceroute",
    "sqlmap",
    "hashcat",
    "aircrack-ng",
    "clear",
    "help",
    "resume",
    "whoami",
    "vulnscan",
    "cat"
  ];

  const handleCommand = (cmd: string) => {
    const clean = cmd.trim().toLowerCase();
    let response = "";

    if (clean === "clear") {
      setHistory([]);
      return;
    }

    if (clean.startsWith("cat")) {
      const parts = clean.split(" ");
      if (parts[1] === "flag.txt") {
        response = "FLAG{5hUbh_D1x1t_K4l1_Pwn3d_2026}";
      } else {
        response = "Usage: cat [filename] (try: cat flag.txt)";
      }
      setHistory(prev => [...prev, cmd, response]);
      return;
    }

    switch (clean) {
      case "welcome":
        response = `
  ____  _   _ _   _ ____  _   _   ____  _____  _____ _____ 
 / ___|| | | | | | | __ )| | | | |  _ \\\\|_ _\\\\ \\/ /_ _|_   _|
 \\___ \\\\| |_| | | | |  _ \\\\| |_| | | | | || | \\\\  / | |  | |  
  ___) |  _  | |_| | |_) |  _  | | |_| || | /  \\\\ | |  | |  
 |____/|_| |_|\\\\___/|____/|_| |_| |____/|___/_/\\\\_\\\\___| |_|  
                                                           

For a list of available commands, type \`help\``;
        break;
      case "help":
        response = `Kali GNU/Linux CLI v2026.2
Commands:
- about             : About Shubh Dixit
- skills            : Interactive technology skills
- experience        : Timeline of research & development roles
- projects          : Showcase core application files
- socials           : View links to Shubh's social profiles & developer accounts
- scan network      : Launch mock Nmap port sweep
- show threat-intel : Active security IDS alert stats
- open browser      : Launch Welcome Browser window
- open cyber-lab    : Launch packet intrusion monitoring lab
- open threat-map   : Launch Global Threat Intelligence Map
- open msf          : Launch Metasploit Framework console
- nmap [target]     : Network port scan
- ifconfig          : Show network interfaces
- netstat           : Show active connections
- ping [host]       : Ping a host
- traceroute [host] : Trace network route
- sqlmap            : SQL injection scanner
- hashcat           : Password hash cracker
- aircrack-ng       : WiFi WPA handshake cracker
- resume            : Download CV/Resume PDF file
- whoami            : Current authenticated profile
- vulnscan          : Run simulated vulnerability scan on localhost
- cat [file]        : Read files (e.g. flag.txt)
- clear             : Clear terminal screen`;
        break;
      case "whoami":
        response = "kali@kali:~$ shubhdixit (Root User)";
        break;
      case "about":
        response = `Shubh Dixit
Headline: AI Research Intern & Cybersecurity Dev
Bio: B.Tech Computer Science student at JKLU, currently conducting Machine Learning research at IIT Ropar & IIT Kanpur. Founder of SeioPluse.`;
        break;
      case "skills":
        response = `TECHNICAL CAPABILITIES:
- Languages   : Python, C, C++, Java, JavaScript, PHP
- AI & ML     : YOLOv8, PyTorch, OpenCV, Transformers, Deep Learning
- Cybersec    : Kali Linux, Wireshark, Nmap, Burp Suite, Threat Intel
- Web Dev     : Next.js, React, Tailwind CSS, Flask, MySQL`;
        break;
      case "experience":
        response = `PROFESSIONAL TIMELINE:
1. IIT Ropar (Research Intern)
   * Artificial Intelligence research, model evaluations, & data metrics.
2. IIT Kanpur (Research Intern)
   * Deep Learning model implementations, CSI compression networks.
3. SeioPluse (Founder)
   * Established startup, built Breast Cancer Segmentation platform.`;
        break;
      case "projects":
        response = `FEATURED SYSTEMS:
1. AI Breast Cancer Detector (YOLOv8/Flask)
2. CSI Feedback Compression (PyTorch Transformers)
3. static Malware Classifier (Scikit-Learn/XGBoost)
4. Hand-Tracking Virtual Guitar Interface (OpenCV)`;
        break;
      case "socials":
        response = `SOCIALS & DEVELOPER PROFILES:
- LinkedIn : https://www.linkedin.com/in/shubhdixit0912/
- GitHub   : https://github.com/Shubhdix9
- LeetCode : https://leetcode.com/u/GhostKernel09
- Email    : shubhdixi9@gmail.com`;
        break;
      case "scan network":
        response = `[+] Initiating Netscan mapping module...
[+] Host 192.168.1.109 is UP.
[+] Open Ports found:
    - 22/TCP   (SSH)
    - 80/TCP   (HTTP)
    - 443/TCP  (HTTPS)
    - 8888/TCP (FLASK-API)`;
        onOpenApp("cyber-lab");
        break;
      case "show threat-intel":
        response = `[ALERT] Intrusion signatures found on SMB port 445!
[ALERT] Isolating source IP 45.109.12.3 at edge proxy.`;
        onOpenApp("cyber-lab");
        break;
      case "open browser":
        response = "[+] Opening Welcome Browser window...";
        onOpenApp("browser");
        break;
      case "open cyber-lab":
        response = "[+] Triggering packet intrusion monitoring lab...";
        onOpenApp("cyber-lab");
        break;
      case "open threat-map":
        response = "[+] Launching Global Threat Intelligence Map...";
        onOpenApp("threat-map");
        break;
      case "open msf":
        response = "[+] Loading Metasploit Framework console...";
        onOpenApp("msf");
        break;
      case "nmap":
        response = `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 192.168.1.1 (local gateway)
Host is up (0.0034s latency).
Not shown: 995 closed ports
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.9p1
80/tcp   open  http       nginx 1.24
443/tcp  open  https      nginx 1.24
3306/tcp open  mysql      MySQL 8.0.32
8080/tcp open  http-proxy Squid 5.7

Service detection: Done. 1 IP address (1 host up) scanned in 2.41s`;
        break;
      case "ifconfig":
        response = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.109  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 8342 bytes 6825432 (6.5 MiB)
        TX packets 3210 bytes 418552 (408.7 KiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)`;
        break;
      case "netstat":
        response = `Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 192.168.1.109:22        10.10.14.2:51234        ESTABLISHED
tcp        0      0 192.168.1.109:443       35.186.224.25:6432      TIME_WAIT
tcp        0      0 192.168.1.109:4444      192.168.1.50:48721      ESTABLISHED
tcp        0      0 192.168.1.109:8080      172.217.14.196:443      ESTABLISHED
tcp6       0      0 :::22                   :::*                    LISTEN`;
        break;
      case "ping":
        response = `PING google.com (142.250.80.46) 56(84) bytes of data.
64 bytes from 142.250.80.46: icmp_seq=1 ttl=118 time=12.4 ms
64 bytes from 142.250.80.46: icmp_seq=2 ttl=118 time=11.8 ms
64 bytes from 142.250.80.46: icmp_seq=3 ttl=118 time=13.1 ms
64 bytes from 142.250.80.46: icmp_seq=4 ttl=118 time=12.2 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 11.8/12.4/13.1/0.5 ms`;
        break;
      case "traceroute":
        response = `traceroute to google.com (142.250.80.46), 30 hops max
 1  192.168.1.1 (192.168.1.1)  0.654 ms  0.512 ms  0.491 ms
 2  10.20.0.1 (10.20.0.1)      5.221 ms  5.103 ms  5.009 ms
 3  72.14.215.165               8.341 ms  8.198 ms  8.112 ms
 4  142.251.227.233            11.021 ms 10.897 ms 10.841 ms
 5  142.250.80.46 (google.com) 12.441 ms 12.289 ms 12.204 ms`;
        break;
      case "sqlmap":
        response = `sqlmap/1.7.8 — Automatic SQL injection tool
[*] Target: http://target.local/login.php?id=1
[*] Testing connection to the target...
[INFO] heuristic check shows parameter 'id' might be injectable
[INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[WARN] GET parameter 'id' does not seem injectable
[INFO] testing 'MySQL >= 5.0 AND error-based'
[INFO] GET parameter 'id' is 'MySQL >= 5.0 error-based' injectable

[+] INJECTABLE: id (MySQL >= 5.0 error-based)
[+] Database: target_db
[+] Tables: users, sessions, products, admin_logs
[+] Dumped: users (47 rows) -> /tmp/sqlmap/dump/users.csv

[*] shutting down at 18:41:03`;
        break;
      case "hashcat":
        response = `hashcat v6.2.6 — Advanced Password Recovery
[*] Hashfile: /root/hashes.txt
[*] Mode: WPA-PBKDF2-PMKID+EAPOL (22000)
[*] Dictionary: rockyou.txt (14,344,391 words)
[*] Hardware: NVIDIA RTX 4090 — 16384 MB / GPU.temp.abort: 90c

Speed.#1.........: 891.2 kH/s (49.78ms) @ Accel:8 Loops:128

Progress: 1234567/14344391 (8.60%)

Cracked Hashes:
-----------------------------------------------
hash: 5f4dcc3b5aa765d61d8327deb882cf99 -> password123
hash: 098f6bcd4621d373cade4e832627b4f6 -> test
hash: e10adc3949ba59abbe56e057f20f883e -> 123456

[+] 3/5 hashes cracked successfully.
Session..........: complete`;
        break;
      case "aircrack-ng":
        response = `Aircrack-ng 1.7
[00:00:01] Reading packets...
[00:00:02] WPA handshake captured: 4E:2F:18:AB:CD:EF

 Opening wordlist: /usr/share/wordlists/rockyou.txt

                               Aircrack-ng 1.7

      [00:00:47] 38401/9822768 keys tested (81432.54 k/s)

      Current passphrase: dragon2020

      Master Key     : 2D 8A E4 F3 11 2B C7 9A 4F 0E D1 86 22 5A 3C B2

      KEY FOUND! [ ilovehacking ]

      Master Key     : 2D 8A E4 F3 11 2B C7 9A 4F 0E D1 86 22 5A 3C B2
      Transient Key  : 74 AF E1 B8 C2 ... <truncated>`;
        break;
      case "resume":
        response = "[+] Opening resume file /Shubh_Dixit_Resume.pdf...";
        window.open("/Shubh_Dixit_Resume.pdf", "_blank");
        break;
      case "vulnscan":
        response = `[*] Initializing Kali Vulnerability Scanner v1.0.4...
[*] Target acquired: 192.168.1.34 (localhost)
[*] Starting TCP SYN port scan (5 ports targeted)...
[+] PORT 22/tcp   open   ssh       (OpenSSH 8.2p1 Ubuntu)
[+] PORT 80/tcp   open   http      (Apache httpd 2.4.41)
[+] PORT 443/tcp  open   https     (Apache httpd 2.4.41 SSL)
[+] PORT 3306/tcp open   mysql     (MySQL 8.0.19)
[+] PORT 8000/tcp open   http-alt  (NodeJS Express server)
[*] Running banner grabbing and vulnerability checks...
[-] SSH 22:    No critical vulnerabilities found.
[!] HTTP 80:   FOUND Exploit Target -> CVE-2021-41773 (Path Traversal / RCE)
[-] HTTPS 443: No critical vulnerabilities found.
[!] MySQL 3306: WARNING -> Default root credentials detected.
[*] Executing proof-of-concept RCE exploit on HTTP Port 80...
[*] Sending malicious HTTP request payload...
[+] Exploit payload sent successfully!
[+] Spawning interactive root reverse shell...
[+] Target Pwned! Connection established.
============================================================
Welcome to the root shell of 192.168.1.34
Hints: Type 'cat flag.txt' to retrieve the hidden flag.
============================================================`;
        break;
      default:
        response = `command not found: ${cmd}. Type 'help' to review list of active modules.`;
    }

    setHistory(prev => [...prev, cmd, response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim() !== "") {
        handleCommand(input);
        setInput("");
        setHints([]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input) return;
      const matched = commandList.filter(c => c.startsWith(input.toLowerCase()));
      if (matched.length === 1) {
        setInput(matched[0]);
        setHints([]);
      } else if (matched.length > 1) {
        setHints(matched);
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full h-full p-4 border border-white/5 rounded-lg font-mono text-sm flex flex-col justify-between cursor-text relative overflow-hidden"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.95)"
      }}
    >
      {/* XFCE Terminal Menu Bar */}
      <div className="flex gap-4 border-b border-white/10 pb-2 mb-2 select-none text-[11px] font-sans text-white/70 print:hidden z-10">
        {["File", "Edit", "View", "Search", "Terminal", "Help"].map((item) => (
          <span key={item} className="hover:text-[#00BCD4] cursor-pointer transition-colors px-0.5">
            {item}
          </span>
        ))}
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-2 pb-4 pr-2 max-h-[420px] z-10">
        <div>Kali GNU/Linux Rolling (kali-rolling)</div>
        <div>Root access shell for user shubhdixit. Privileges: unrestricted.</div>
        <div className="text-[#00BCD4] font-bold">Type "help" to review active CLI modules.</div>

        {history.map((line, idx) => {
          if (idx % 2 === 0) {
            const typedCmd = line.trim().toLowerCase().split(" ")[0];
            const isMatch = commandList.includes(typedCmd);
            return (
              <div key={idx} className="flex items-center gap-1 font-mono">
                <span className="font-bold"><span className="text-[#FF6B6B]">kali</span><span className="text-white/60">@</span><span className="text-[#FF6B6B]">kali</span><span className="text-white/60">:~$</span></span>
                <span className={isMatch ? "text-[#00BCD4] font-bold" : "text-white"}>{line}</span>
              </div>
            );
          } else {
            return (
              <div 
                key={idx} 
                className="whitespace-pre-wrap text-white/90 leading-relaxed pl-4 border-l border-white/10"
                dangerouslySetInnerHTML={{ __html: formatTerminalOutput(line) }}
              />
            );
          }
        })}

        {hints.length > 1 && (
          <div className="text-[#00BCD4] font-semibold">
            Suggestions: {hints.join("  |  ")}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-2 mt-2 z-10">
        <div className="flex items-center gap-1 font-mono">
          <span className="font-bold"><span className="text-[#FF6B6B]">kali</span><span className="text-white/60">@</span><span className="text-[#FF6B6B]">kali</span><span className="text-white/60">:~$</span></span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Navigation Guide */}
        <div className="border-t border-white/5 pt-1.5 flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-white/50 font-sans print:hidden">
          <div>
            <span className="text-white">Tab or Ctrl + i</span> <span className="text-white/40">Autocomplete</span>
          </div>
          <div>
            <span className="text-white">Up Arrow</span> <span className="text-white/40">History</span>
          </div>
          <div>
            <span className="text-white">Ctrl + L</span> <span className="text-white/40">Clear Screen</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. RECRUITER VIEW CV COMPONENT
// ==========================================
interface RecruiterViewProps {
  onBack: () => void;
}

function RecruiterView({ onBack }: RecruiterViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-screen h-screen bg-[#F8FAFC] text-[#0F172A] z-[9999] overflow-hidden selection:bg-indigo-500 selection:text-white"
    >
      <div className="w-full h-full overflow-y-auto p-6 md:p-12">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl border border-slate-200 p-8 space-y-6">
          {/* Navigation bar */}
          <div className="flex justify-between items-center print:hidden border-b border-slate-100 pb-4">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              ← Back to OS Workspace
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              Print / Save PDF
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-800 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">SHUBH DIXIT</h1>
              <p className="text-lg font-bold text-indigo-600 mt-1">AI Research Intern | Cybersecurity Specialist</p>
              <p className="text-sm text-slate-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <span>📍 Jaipur, Rajasthan, India</span>
                <span>📧 shubhdixi9@gmail.com</span>
                <span>📱 +91 6375488022</span>
              </p>
            </div>
          </div>

          {/* Grid Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <section className="space-y-2">
                <h2 className="text-base font-extrabold border-b border-slate-300 pb-1 text-slate-800 uppercase tracking-wider">
                  Summary
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Computer Science student at JKLU, currently conducting Artificial Intelligence and Deep Learning research at IIT Ropar & IIT Kanpur. Focused on neural transformer architectures, computer vision diagnostics, and static threat intelligence classifiers. Founder of SeioPluse healthcare startup.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-base font-extrabold border-b border-slate-300 pb-1 text-slate-800 uppercase tracking-wider">
                  Research & Professional Experience
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-sm text-slate-800">
                    <span>Research Intern — IIT Ropar</span>
                    <span>May 2026 – Present</span>
                  </div>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                    <li>Formulating AI research models for computer vision benchmarks.</li>
                    <li>Conducting model training configurations and hyperparameter optimizations.</li>
                    <li>Documenting network data patterns and performance metrics.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-sm text-slate-800">
                    <span>Research Intern — IIT Kanpur</span>
                    <span>May 2026 – Present</span>
                  </div>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                    <li>Building Transformer frameworks for MIMO system CSI Feedback Compression in PyTorch.</li>
                    <li>Analyzing speedups achieved by eliminating classical LSTM recurrence structures.</li>
                    <li>Optimizing deep neural networks for edge network platforms.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-sm text-slate-800">
                    <span>Founder — SeioPluse Startup</span>
                    <span>2025 – Present</span>
                  </div>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                    <li>Architected an AI-powered healthcare diagnostics system for mammogram analysis.</li>
                    <li>Trained YOLOv8 segmentation classifiers achieving F1 score ~ 0.98.</li>
                    <li>Deployed web interfaces using Python Flask, OpenCV, and relational databases.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-extrabold border-b border-slate-300 pb-1 text-slate-800 uppercase tracking-wider">
                  Featured Projects
                </h2>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-800">AI Breast Cancer Detector (YOLOv8)</h4>
                  <p className="text-xs text-slate-600">Computer vision model trained to segment mammographic tumor targets, deployed as a diagnostic Flask web portal.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-800">CSI Transformer Feedback Compressor</h4>
                  <p className="text-xs text-slate-600">Wireless MIMO signal compression layer using PyTorch self-attention block elements, accelerating latency indexes.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-800">Malware static Detector Classifier</h4>
                  <p className="text-xs text-slate-600">Bytecode attribute extractor parsing PE headers to trigger XGBoost model flags for threat intrusion isolation.</p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6">
              <section className="space-y-3">
                <h2 className="text-base font-extrabold border-b border-slate-300 pb-1 text-slate-800 uppercase tracking-wider">
                  Skills
                </h2>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 uppercase">Languages</h4>
                    <p className="text-xs text-slate-600 mt-1">Python, C, C++, Java, JavaScript, PHP</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 uppercase">AI & ML</h4>
                    <p className="text-xs text-slate-600 mt-1">YOLOv8, PyTorch, OpenCV, Transformers, CNNs, MediaPipe</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 uppercase">Cybersecurity</h4>
                    <p className="text-xs text-slate-600 mt-1">Linux, Kali Linux, Wireshark, Nmap, Static Analysis, Threat Intelligence</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 uppercase">Development</h4>
                    <p className="text-xs text-slate-600 mt-1">Next.js, React, Tailwind CSS, Flask, MySQL, Git</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-extrabold border-b border-slate-300 pb-1 text-slate-800 uppercase tracking-wider">
                  Education
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="font-bold text-xs text-slate-800">JK Lakshmipat University</div>
                    <p className="text-[11px] text-slate-500">B.Tech CS Engineering | 2025 - Present</p>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">IIIT Delhi</div>
                    <p className="text-[11px] text-slate-500">Semester Exchange Student | 2026</p>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-extrabold border-b border-slate-300 pb-1 text-slate-800 uppercase tracking-wider">
                  Honors
                </h2>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                  <li>IIT Kanpur Research Scholar Award</li>
                  <li>IIT Ropar Research Scholarship</li>
                  <li>Founder of AI Healthcare Startup</li>
                  <li>50% JKLU Academic Merit Scholarship</li>
                  <li>60% LPUNEST Merit Scholarship</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 8. SYSTEM MONITOR WIDGET (XFCE STYLE)
// ==========================================
function SystemMonitorWidget({
  label,
  value,
  history,
  color,
  fillId,
  icon,
}: {
  label: string;
  value: number;
  history: number[];
  color: string;
  fillId: string;
  icon: React.ReactNode;
}) {
  const width = 50;
  const height = 18;
  const maxVal = 100;
  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * width;
    const y = height - (val / maxVal) * height;
    return `${x},${y}`;
  });

  const pathD = points.length ? `M ${points.join(" L ")}` : "";
  const areaD = points.length ? `${pathD} L ${width},${height} L 0,${height} Z` : "";

  // 10 LED segments (htop style)
  const totalSegments = 10;
  const activeSegments = Math.round((value / 100) * totalSegments);

  return (
    <div className="flex items-center gap-2 px-2 py-0.5 bg-[#121212]/80 border border-white/10 rounded shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] backdrop-blur-sm select-none">
      {/* Icon and Label */}
      <div className="flex items-center gap-1 min-w-[44px]">
        <span style={{ color }} className="opacity-90">{icon}</span>
        <span className="text-[9px] text-white/77 font-mono font-bold uppercase tracking-wider">{label}</span>
      </div>

      {/* Mini XFCE Graph */}
      <div className="relative w-[50px] h-[18px] bg-black/60 border border-white/5 rounded-sm overflow-hidden flex items-center">
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="1,1" />
          <line x1={width / 3} y1="0" x2={width / 3} y2={height} stroke="rgba(255,255,255,0.06)" strokeDasharray="1,1" />
          <line x1={(2 * width) / 3} y1="0" x2={(2 * width) / 3} y2={height} stroke="rgba(255,255,255,0.06)" strokeDasharray="1,1" />

          {/* Area fill */}
          <path d={areaD} fill={`url(#${fillId})`} />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="1" />
        </svg>
      </div>

      {/* htop style progress bar */}
      <div className="flex items-center gap-0.5 bg-black/50 border border-white/5 rounded px-1 py-0.5 h-[18px] text-[8px] font-mono">
        <span className="text-white/35 font-semibold font-mono">[</span>
        <div className="flex gap-[0.5px]">
          {Array.from({ length: totalSegments }).map((_, idx) => {
            const isActive = idx < activeSegments;
            let segmentColor = "bg-white/5";
            if (isActive) {
              if (idx < 5) segmentColor = "bg-[#4CAF50]"; // Green
              else if (idx < 8) segmentColor = "bg-[#FFB800]"; // Yellow
              else segmentColor = "bg-[#FF4D4D]"; // Red
            }
            return (
              <div
                key={idx}
                className={`w-[2.5px] h-2 rounded-[0.5px] transition-colors duration-300 ${segmentColor}`}
              />
            );
          })}
        </div>
        <span className="text-white/35 font-semibold font-mono">]</span>
      </div>

      {/* Percentage Value */}
      <span className="text-[10px] font-bold text-white min-w-[28px] text-right font-mono">
        {value}%
      </span>
    </div>
  );
}

// ==========================================
// 8. MAIN PAGE ROUTER COMPONENT
// ==========================================
export default function Home() {
  // Navigation flow state: "BIOS" | "KERNEL" | "AUTH" | "OS" | "RECRUITER"
  const [flowState, setFlowState] = useState<"BIOS" | "KERNEL" | "AUTH" | "OS" | "RECRUITER">("BIOS");
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [authPassword, setAuthPassword] = useState("");
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceScanSuccess, setFaceScanSuccess] = useState(false);
  
  // OS active windows state
  const [openApps, setOpenApps] = useState<{ [key: string]: boolean }>({
    terminal: false,
    browser: true,
    "cyber-lab": false,
    "threat-map": false,
    "msf": false,
    projects: false
  });
  
  // Stacking z-indices
  const [zIndices, setZIndices] = useState<{ [key: string]: number }>({
    terminal: 5,
    browser: 12,
    "cyber-lab": 5,
    "threat-map": 5,
    "msf": 5,
    projects: 5
  });

  const [topZ, setTopZ] = useState(11);
  const [sysCpu, setSysCpu] = useState(12);
  const [sysRam, setSysRam] = useState(38);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(15).fill(12));
  const [ramHistory, setRamHistory] = useState<number[]>(Array(15).fill(38));

  const focusApp = (appKey: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setZIndices(prev => ({ ...prev, [appKey]: nextZ }));
  };

  const toggleApp = (appKey: string) => {
    setOpenApps(prev => {
      const state = !prev[appKey];
      if (state) {
        focusApp(appKey);
      }
      return { ...prev, [appKey]: state };
    });
  };

  const openAppExplicit = (appKey: string) => {
    setOpenApps(prev => ({ ...prev, [appKey]: true }));
    focusApp(appKey);
  };

  // BIOS logs generation
  useEffect(() => {
    if (flowState !== "BIOS") return;
    
    const logs = [
      "KALI LINUX BOOT DIAGNOSTICS LOADED",
      "CORE ENGINE MEMORY SWEEP... COMPLETE (64GB VRAM)",
      "CHECKING SECURE HASH BLOCK SIGNATURE... VALID",
      "MOUNTING HOST NODE FILE WRAPPER... SUCCESS",
      "TRANSITIONING KERNEL LOADER..."
    ];

    let timer = 0;
    logs.forEach((log, idx) => {
      setTimeout(() => {
        setBootLogs(prev => [...prev, log]);
        if (idx === logs.length - 1) {
          setTimeout(() => setFlowState("KERNEL"), 1200);
        }
      }, timer);
      timer += 400;
    });
  }, [flowState]);

  // System Monitor Ticker
  useEffect(() => {
    if (flowState !== "OS") return;
    const interval = setInterval(() => {
      const nextCpu = Math.floor(Math.random() * 20) + 5;
      const nextRam = Math.floor(Math.random() * 5) + 36;
      setSysCpu(nextCpu);
      setSysRam(nextRam);
      setCpuHistory(prev => [...prev.slice(1), nextCpu]);
      setRamHistory(prev => [...prev.slice(1), nextRam]);
    }, 2000);
    return () => clearInterval(interval);
  }, [flowState]);

  // Biometric Face Scan handler
  const triggerFaceScan = () => {
    setIsFaceScanning(true);
    setTimeout(() => {
      setFaceScanSuccess(true);
    }, 2000);
    setTimeout(() => {
      setFlowState("OS");
      setIsFaceScanning(false);
    }, 3000);
  };

  return (
    <div className="w-screen h-screen relative select-none overflow-hidden">
      <AnimatePresence mode="wait">
        {/* FLOW 1: BIOS CHECK */}
        {flowState === "BIOS" && (
          <motion.div
            key="bios"
            exit={{ opacity: 0 }}
            className="w-full h-full bg-[#050505] p-8 text-primary font-mono text-xs flex flex-col justify-between"
          >
            <div className="space-y-2">
              {bootLogs.map((log, idx) => (
                <div key={idx}>
                  <span className="text-secondary">[BOOT]</span> {log}
                </div>
              ))}
              <span className="inline-block w-2.5 h-4 bg-primary animate-pulse" />
            </div>
            <div className="text-[10px] opacity-40">KALI LINUX rolling V2026.2 BIOS SCREEN</div>
          </motion.div>
        )}

        {/* FLOW 2: KERNEL STATUS LOADER */}
        {flowState === "KERNEL" && (
          <motion.div
            key="kernel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full bg-[#050505] flex flex-col justify-center items-center font-mono text-xs"
          >
            <div className="max-w-md w-full px-6 space-y-4">
              <div className="text-center font-bold tracking-widest text-primary">INITIALIZING SECURITIES CORE</div>
              <div className="border border-primary/25 p-4 bg-black/85 rounded font-mono text-[11px] space-y-2 shadow-[0_0_20px_rgba(0,255,136,0.05)]">
                <div className="flex gap-3">
                  <span className="text-primary font-bold">[  OK  ]</span>
                  <span className="text-primary/90 font-medium">Started LVM2 PV scan on device 8:2.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-bold">[  OK  ]</span>
                  <span className="text-primary/90 font-medium">Connecting to Neural Network engine database...</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-bold">[  OK  ]</span>
                  <span className="text-primary/90 font-medium">Mounted /home/shubhdixit encrypt container.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-warning font-bold">[ WARN ]</span>
                  <span className="text-warning/90 font-medium">Isolated non-critical device bypass parameters.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-bold">[  OK  ]</span>
                  <span className="text-primary/90 font-medium">Started Threat Intelligence security core firewall.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-danger font-bold">[FAILED]</span>
                  <span className="text-danger/90 font-medium">Failed to mount guest user space (Root login active).</span>
                </div>
              </div>
              <div className="w-full bg-primary/10 h-2 rounded overflow-hidden relative border border-primary/20">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute w-1/2 h-full bg-primary shadow-[0_0_8px_#00FF88]"
                />
              </div>
              <div className="text-[10px] text-center text-primary/50">Initializing user account...</div>
            </div>
            <button
              onClick={() => setFlowState("AUTH")}
              className="absolute bottom-10 px-4 py-2 border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded transition-colors"
            >
              BYPASS KERNEL
            </button>
          </motion.div>
        )}

        {/* FLOW 3: LOGIN AUTHORIZATION SCREEN */}
        {flowState === "AUTH" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full bg-[#050505] flex flex-col justify-center items-center p-6 relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/pink-kali.png')" }}
          >
            <MatrixRain />
            
            <div className="z-10 w-full max-w-sm glassmorphism p-6 rounded-xl flex flex-col items-center space-y-6 text-center shadow-2xl relative glow-secondary/10">
              <div className="flex flex-col items-center gap-3">
                <img
                  src="/kali-logo.svg"
                  alt="Kali Linux"
                  className="w-16 h-16 object-contain filter drop-shadow-[0_0_12px_rgba(0,212,255,0.4)] animate-bounce"
                  style={{ animationDuration: "3s" }}
                />
                <div>
                  <h2 className="text-lg font-bold font-mono tracking-wide text-white">SHUBH DIXIT</h2>
                  <p className="text-[10px] text-secondary font-mono tracking-wider">AI RESEARCHER & SECURITY DEV</p>
                </div>
              </div>

              {/* Face scan effect */}
              {isFaceScanning ? (
                <div className="w-full p-4 border border-secondary/35 bg-secondary/5 rounded-lg flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
                  <motion.div
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute left-0 right-0 h-0.5 bg-secondary shadow-lg z-20"
                  />
                  <Eye className="text-secondary animate-pulse" size={24} />
                  <span className="font-mono text-[10px] text-secondary">
                    {faceScanSuccess ? "IDENTIFIED SUCCESSFUL" : "SCANNING FACIAL ATTRIBUTES..."}
                  </span>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="ENTER PIN OR CREDENTIALS"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded font-mono text-center text-xs text-secondary outline-none focus:border-secondary"
                    />
                    <button
                      onClick={() => setFlowState("OS")}
                      className="px-3 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/40 rounded flex items-center justify-center"
                    >
                      <Unlock size={14} />
                    </button>
                  </div>

                  <button
                    onClick={triggerFaceScan}
                    className="w-full py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary font-mono text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye size={14} /> BIOMETRIC FACIAL SCAN
                  </button>
                </div>
              )}

              <div className="text-[9px] opacity-40 font-mono">Bypass: Click Facial Scan or submit credentials.</div>
            </div>
          </motion.div>
        )}

        {/* FLOW 4: MAIN OPERATING SYSTEM WORKSPACE */}
        {flowState === "OS" && (
          <motion.div
            key="os"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full bg-[#050505] relative flex flex-col justify-between bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/kali-ferrofluid.jpg')" }}
          >
            {/* Matrix Background rain drops */}
            <MatrixRain />

            {/* Taskbar Header */}
            <header className="z-50 h-12 w-full glassmorphism flex justify-between items-center px-4 border-b border-white/10 bg-black/45 shadow-lg">
              <div className="flex items-center gap-4">
                <span className="font-sans font-bold text-base tracking-wider text-slate-100 flex items-center gap-2">
                  <img src="/kali-logo.svg" className="w-7 h-7 object-contain filter drop-shadow-[0_0_8px_rgba(0,188,212,0.5)] animate-pulse" alt="Kali Logo" />
                  KALI LINUX
                </span>
                <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-mono font-bold">ROOT SESSION</span>
              </div>

              {/* System metrics monitor */}
              <div className="flex gap-3 font-mono text-xs items-center">
                <SystemMonitorWidget
                  label="CPU"
                  value={sysCpu}
                  history={cpuHistory}
                  color="#00BCD4"
                  fillId="cpu-graph-fill"
                  icon={<Cpu size={13} />}
                />
                <SystemMonitorWidget
                  label="RAM"
                  value={sysRam}
                  history={ramHistory}
                  color="#4CAF50"
                  fillId="ram-graph-fill"
                  icon={<Layers size={13} />}
                />
                <button
                  onClick={() => setFlowState("RECRUITER")}
                  className="px-3.5 py-1.5 bg-primary/20 border border-primary/40 hover:bg-primary/30 text-primary text-xs font-bold font-sans rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <User size={14} /> RECRUITER VIEW
                </button>
              </div>
            </header>

            {/* Application Workspace Area */}
            <main className="z-10 flex-1 relative p-6">
              {/* Desktop Icons Left */}
              <div className="absolute left-6 top-6 flex flex-col gap-6 z-20">
                <button
                  onClick={() => toggleApp("terminal")}
                  className={`flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent ${
                    openApps.terminal ? "border-primary/20 bg-primary/5" : ""
                  } w-24 transition-colors cursor-pointer`}
                >
                  <TermIcon size={36} className="text-primary" />
                  <span className="text-xs font-mono text-center">CLI SHELL</span>
                </button>

                <button
                  onClick={() => toggleApp("browser")}
                  className={`flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent ${
                    openApps.browser ? "border-secondary/20 bg-secondary/5" : ""
                  } w-24 transition-colors cursor-pointer`}
                >
                  <Monitor size={36} className="text-secondary animate-pulse" />
                  <span className="text-xs font-mono text-center">BROWSER</span>
                </button>

                <button
                  onClick={() => toggleApp("cyber-lab")}
                  className={`flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent ${
                    openApps["cyber-lab"] ? "border-danger/20 bg-danger/5" : ""
                  } w-24 transition-colors cursor-pointer`}
                >
                  <Shield size={36} className="text-danger" />
                  <span className="text-xs font-mono text-center">NET LAB</span>
                </button>

                <button
                  onClick={() => toggleApp("threat-map")}
                  className={`flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent ${
                    openApps["threat-map"] ? "border-[#00BCD4]/20 bg-[#00BCD4]/5" : ""
                  } w-24 transition-colors cursor-pointer`}
                >
                  <Globe size={36} className="text-[#00BCD4]" />
                  <span className="text-xs font-mono text-center">THREAT MAP</span>
                </button>

                <button
                  onClick={() => toggleApp("msf")}
                  className={`flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent ${
                    openApps["msf"] ? "border-green-500/20 bg-green-500/5" : ""
                  } w-24 transition-colors cursor-pointer`}
                >
                  <Target size={36} className="text-green-400" />
                  <span className="text-xs font-mono text-center">MSF</span>
                </button>

                <button
                  onClick={() => toggleApp("projects")}
                  className={`flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent ${
                    openApps.projects ? "border-warning/20 bg-warning/5" : ""
                  } w-24 transition-colors cursor-pointer`}
                >
                  <FileText size={36} className="text-warning" />
                  <span className="text-xs font-mono text-center">PROJECTS</span>
                </button>

                <button
                  onClick={() => window.open("/Shubh_Dixit_Resume.pdf", "_blank")}
                  className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent w-24 transition-colors cursor-pointer text-slate-300 hover:text-white"
                >
                  <FileText size={36} className="text-white/80" />
                  <span className="text-xs font-mono text-center">RESUME PDF</span>
                </button>

                <button
                  onClick={() => window.open("https://github.com/Shubhdix9", "_blank")}
                  className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent w-24 transition-colors cursor-pointer text-slate-300 hover:text-white"
                >
                  <svg className="w-9 h-9 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.29-1.23 3.29-1.23.67 1.66.25 2.88.13 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.81 5.61-5.48 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.58A12 12 0 0012 .5z"/>
                  </svg>
                  <span className="text-xs font-mono text-center">GITHUB</span>
                </button>

                <button
                  onClick={() => window.open("https://www.linkedin.com/in/shubhdixit0912/", "_blank")}
                  className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent w-24 transition-colors cursor-pointer text-slate-300 hover:text-white"
                >
                  <svg className="w-9 h-9 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.2 2.3-2.47 4.73-2.47 5.06 0 6 3.33 6 7.66V24h-5v-7.58c0-1.81-.03-4.14-2.52-4.14-2.52 0-2.9 1.97-2.9 4v7.72h-5V8z" />
                  </svg>
                  <span className="text-xs font-mono text-center">LINKEDIN</span>
                </button>

                <button
                  onClick={() => window.open("https://leetcode.com/u/GhostKernel09", "_blank")}
                  className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 border border-transparent w-24 transition-colors cursor-pointer text-slate-300 hover:text-white"
                >
                  <svg className="w-9 h-9 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.102 17.93l-2.69 2.607c-.466.451-1.111.696-1.744.696a2.285 2.285 0 0 1-1.744-.696L3.666 14.3a2.435 2.435 0 0 1 0-3.437l5.568-5.399a2.285 2.285 0 0 1 1.744-.696c.632 0 1.278.245 1.744.696l2.69 2.607a.724.724 0 0 1 0 1.027.766.766 0 0 1-1.059 0l-2.69-2.607c-.19-.184-.519-.184-.709 0l-5.568 5.399a.913.913 0 0 0 0 1.283l6.257 6.256c.19.184.518.184.709 0l2.69-2.607a.766.766 0 0 1 1.059 0 .724.724 0 0 1 0 1.027zm4.232-5.467h-7.662a.747.747 0 0 1-.767-.726c0-.4.344-.726.767-.726h7.662c.423 0 .767.325.767.726a.747.747 0 0 1-.767.726zm-2.029-4.88h-3.604a.747.747 0 0 1-.767-.726c0-.4.344-.726.767-.726h3.604c.423 0 .767.325.767.726a.747.747 0 0 1-.767.726z"/>
                  </svg>
                  <span className="text-xs font-mono text-center">LEETCODE</span>
                </button>
              </div>

              {/* Windows Area */}
              <AnimatePresence>
                {/* 1. CLI TERMINAL SHELL */}
                {openApps.terminal && (
                  <WindowFrame
                    key="terminal"
                    title="kali@kali: ~"
                    icon={<TermIcon size={16} />}
                    isOpen={openApps.terminal}
                    onClose={() => toggleApp("terminal")}
                    onFocus={() => focusApp("terminal")}
                    zIndex={zIndices.terminal}
                    initialX={100}
                    initialY={50}
                    initialWidth={760}
                    initialHeight={500}
                  >
                    <TerminalApp onOpenApp={openAppExplicit} />
                  </WindowFrame>
                )}

                {/* 2. Welcome Browser Welcome App */}
                {openApps.browser && (
                  <WindowFrame
                    key="browser"
                    title="Browser"
                    icon={<Monitor size={16} />}
                    isOpen={openApps.browser}
                    onClose={() => toggleApp("browser")}
                    onFocus={() => focusApp("browser")}
                    zIndex={zIndices.browser}
                    initialX={160}
                    initialY={80}
                    initialWidth={820}
                    initialHeight={540}
                  >
                    <BrowserApp />
                  </WindowFrame>
                )}

                {/* 3. INTRUSION INJECTION CYBER LAB */}
                {openApps["cyber-lab"] && (
                  <WindowFrame
                    key="cyber-lab"
                    title="SOC Cybersecurity Intrusion Lab"
                    icon={<Shield size={16} />}
                    isOpen={openApps["cyber-lab"]}
                    onClose={() => toggleApp("cyber-lab")}
                    onFocus={() => focusApp("cyber-lab")}
                    zIndex={zIndices["cyber-lab"]}
                    initialX={220}
                    initialY={110}
                    initialWidth={860}
                    initialHeight={560}
                  >
                    <CyberLab />
                  </WindowFrame>
                )}

                {/* 4. PROJECTS SPEC SHEET */}
                {openApps.projects && (
                  <WindowFrame
                    key="projects"
                    title="Core Projects Repository"
                    icon={<FileText size={16} />}
                    isOpen={openApps.projects}
                    onClose={() => toggleApp("projects")}
                    onFocus={() => focusApp("projects")}
                    zIndex={zIndices.projects}
                    initialX={260}
                    initialY={70}
                    initialWidth={800}
                    initialHeight={520}
                  >
                    <ProjectsApp />
                  </WindowFrame>
                )}

                {/* 5. GLOBAL THREAT MAP */}
                {openApps["threat-map"] && (
                  <WindowFrame
                    key="threat-map"
                    title="Global Threat Intelligence Map"
                    icon={<Globe size={16} />}
                    isOpen={openApps["threat-map"]}
                    onClose={() => toggleApp("threat-map")}
                    onFocus={() => focusApp("threat-map")}
                    zIndex={zIndices["threat-map"]}
                    initialX={80}
                    initialY={60}
                    initialWidth={920}
                    initialHeight={560}
                  >
                    <ThreatMap />
                  </WindowFrame>
                )}

                {/* 6. MSF CONSOLE */}
                {openApps["msf"] && (
                  <WindowFrame
                    key="msf"
                    title="Metasploit Framework Console"
                    icon={<Target size={16} />}
                    isOpen={openApps["msf"]}
                    onClose={() => toggleApp("msf")}
                    onFocus={() => focusApp("msf")}
                    zIndex={zIndices["msf"]}
                    initialX={140}
                    initialY={100}
                    initialWidth={760}
                    initialHeight={500}
                  >
                    <MSFConsole />
                  </WindowFrame>
                )}
              </AnimatePresence>
            </main>

            {/* Bottom Status bar */}
            <footer className="z-50 h-10 w-full glassmorphism flex justify-between items-center px-4 border-t border-white/10 bg-black/45 font-mono text-[11px] opacity-80">
              <div className="flex gap-4">
                <span>OS TYPE: KALI GNU/LINUX</span>
                <span>KERNEL: 6.12.0-kali-amd64</span>
              </div>
              <div>(c) 2026 Shubh Dixit. Environment: LightDM/XFCE.</div>
            </footer>
          </motion.div>
        )}

        {/* FLOW 5: RECRUITER VIEW (EXPORTS SUMMARY) */}
        {flowState === "RECRUITER" && (
          <RecruiterView onBack={() => setFlowState("OS")} />
        )}
      </AnimatePresence>
    </div>
  );
}
