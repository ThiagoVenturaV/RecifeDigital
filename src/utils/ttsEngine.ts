class TTSEngine {
  private synth: SpeechSynthesis | null = null;
  private isEnabled: boolean = false;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Find pt-BR voice or fallback to default
    const ptVoice = voices.find(v => v.lang.startsWith('pt'));
    if (ptVoice) {
      this.selectedVoice = ptVoice;
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    } else {
      this.speak('Leitor de tela nativo ativado. O conteúdo da página será lido em voz alta.');
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public speak(text: string, force: boolean = false) {
    if ((!this.isEnabled && !force) || !this.synth || !text.trim()) return;

    // Cancel current speaking
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0; // Speech speed
    utterance.pitch = 1.0;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const tts = new TTSEngine();
