"use client"

export function ConfigWindow() {
  const commands = [
    { cmd: "/help", desc: "Show this help window" },
    { cmd: "/scan", desc: "Scan network for anomalies" },
    { cmd: "/trace", desc: "Trace mimic detection" },
    { cmd: "/purge", desc: "Clear last 10 messages" },
    { cmd: "/seed", desc: "Seed chat with AI lore" },
    { cmd: "/face", desc: "Toggle face panel" },
    { cmd: "/buy", desc: "Open external link" },
    { cmd: "/x", desc: "Open X/Twitter" },
  ]

  const keybinds = [
    { key: "Esc", desc: "Close focused window" },
    { key: "⌘/Ctrl+K", desc: "Focus command input" },
  ]

  return (
    <div className="p-4 space-y-4 text-sm">
      <div>
        <h3 className="text-primary font-bold mb-2 tracking-wider">COMMANDS</h3>
        <div className="space-y-1">
          {commands.map((item, i) => (
            <div key={i} className="flex gap-3">
              <code className="text-accent">{item.cmd}</code>
              <span className="text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-primary font-bold mb-2 tracking-wider">KEYBINDS</h3>
        <div className="space-y-1">
          {keybinds.map((item, i) => (
            <div key={i} className="flex gap-3">
              <code className="text-accent">{item.key}</code>
              <span className="text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The 2017 Protocol Console v1.4 — A post-apocalyptic terminal interface inspired by the Dead Internet Theory.
        </p>
      </div>
    </div>
  )
}
