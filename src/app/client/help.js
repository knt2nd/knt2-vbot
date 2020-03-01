export default class Help {
  constructor(i18n, plugin) {
    this.i18n = i18n;
    this.plugin = plugin;
  }

  get(lang) {
    const langs = [lang, ...this.i18n.lang[lang].fallbacks];
    let chelp = ['[Chat Commands]', 'Example:', '  !t こんにちは', '  !s;tts=ja;pitch=30 Hello', ''];
    let vhelp = ['[Voice Commands]'];
    this.plugin.plugins.forEach(p => {
      if (!p.settings.active) return;
      if (p.chatCommands) {
        p.chatCommands.forEach(c => {
          chelp.push(`- ${p.name.replace(/^@/, '')}.${c.name}: ${c.word.map(w => `!${w}`).join(', ')}`);
          if (c.description) chelp.push(`  ${c.description}`);
          if (!c.options) return;
          Object.keys(c.options).forEach(key => {
            const o = c.options[key];
            let d = '';
            switch (o.type) {
              case Number:
                if (o.min === undefined && o.max === undefined) {
                  d = 'number';
                } else {
                  d = `${o.min === undefined ? '' : o.min}-${o.max === undefined ? '' : o.max}`;
                }
                break;
              case String:
                if (o.eg === undefined) {
                  d = 'string';
                } else {
                  d = `e.g. ${o.eg}`;
                }
                break;
              case Boolean:
                d = '0 or 1';
                break;
            }
            chelp.push(`  ${key}: ${d}`);
          });
        });
      }
      if (p.voiceCommands) {
        p.voiceCommands.forEach(c => {
          const v = [];
          langs.forEach(l => {
            if (!c.word[l]) return;
            c.word[l].forEach(w => {
              const r = Array.isArray(w) ? w[0] : w;
              v.push(r.toString());
            });
          });
          if (v.length) {
            let header = `- ${p.name.replace(/^@/, '')}.${c.name}`;
            if (c.description) header += ` - ${c.description}`;
            if (!c.description && v.length === 1) {
              vhelp.push(`${header}: ${v[0]}`);
            } else {
              vhelp.push(header, ...v.map(r => `  ${r}`));
            }
          }
        });
      }
    });
    if (vhelp.length === 1) vhelp.push('No voice command');
    return chelp.join('\n') + '\n\n' + vhelp.join('\n');
  }
}
