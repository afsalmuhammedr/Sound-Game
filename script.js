class EnhancedAudioSurvivalGame {
            constructor() {
                this.audioContext = null;
                this.ambientSource = null;
                this.isPlaying = false;
                this.score = 0;
                this.lives = 3;
                this.currentChallenge = null;
                this.challengeTimeout = null;
                this.progressInterval = null;
                this.timeLeft = 0;
                this.maxTime = 6000;
                this.soundsLoaded = false;
                this.animalSounds = {};
                
                this.threats = [
                    { sound: 'lion', direction: 'left', escape: 'right', frequency: 220, description: 'Lion roaring' },
                    { sound: 'elephant', direction: 'right', escape: 'left', frequency: 440, description: 'Elephant trumpeting' },
                    { sound: 'tiger', direction: 'up', escape: 'down', frequency: 880, description: 'Tiger growling' },
                    { sound: 'bear', direction: 'down', escape: 'up', frequency: 110, description: 'Bear growling' }
                ];
                
                this.initializeElements();
                this.setupEventListeners();
                this.createAnimalSounds();
            }
            
            initializeElements() {
                this.startBtn = document.getElementById('startBtn');
                this.stopBtn = document.getElementById('stopBtn');
                this.gameStatus = document.getElementById('gameStatus');
                this.loadingStatus = document.getElementById('loadingStatus');
                this.scoreElement = document.getElementById('score');
                this.livesElement = document.getElementById('lives');
                this.voiceGuidanceCheckbox = document.getElementById('voiceGuidance');
                this.ambientSoundsCheckbox = document.getElementById('ambientSounds');
                this.realisticSoundsCheckbox = document.getElementById('realisticSounds');
                this.timeProgress = document.getElementById('timeProgress');
                this.gestureButtons = document.querySelectorAll('.gesture-btn');
            }
            
            async createAnimalSounds() {
                // Initialize Audio Context for sound generation
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    
                    // Create more realistic animal sounds using multiple oscillators and filters
                    await this.generateLionRoar();
                    await this.generateElephantTrumpet();
                    await this.generateTigerGrowl();
                    await this.generateBearGrowl();
                    
                    this.soundsLoaded = true;
                    this.loadingStatus.textContent = "🎵 Realistic animal sounds loaded! Ready to play.";
                    this.loadingStatus.style.color = "#2ecc71";
                    
                } catch (error) {
                    console.error('Error creating sounds:', error);
                    this.loadingStatus.textContent = "⚠️ Using fallback sounds. Game ready to play.";
                    this.soundsLoaded = false;
                }
            }
            
            async generateLionRoar() {
                // Create a complex lion roar using multiple oscillators
                this.animalSounds.lion = (panValue, gainNode) => {
                    const oscillator1 = this.audioContext.createOscillator();
                    const oscillator2 = this.audioContext.createOscillator();
                    const oscillator3 = this.audioContext.createOscillator();
                    const filter = this.audioContext.createBiquadFilter();
                    const pannerNode = this.audioContext.createStereoPanner();
                    
                    // Main roar frequency
                    oscillator1.frequency.setValueAtTime(80, this.audioContext.currentTime);
                    oscillator1.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
                    oscillator1.frequency.exponentialRampToValueAtTime(120, this.audioContext.currentTime + 1.0);
                    oscillator1.type = 'sawtooth';
                    
                    // Harmonic
                    oscillator2.frequency.setValueAtTime(160, this.audioContext.currentTime);
                    oscillator2.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
                    oscillator2.frequency.exponentialRampToValueAtTime(240, this.audioContext.currentTime + 1.0);
                    oscillator2.type = 'square';
                    
                    // Low rumble
                    oscillator3.frequency.setValueAtTime(40, this.audioContext.currentTime);
                    oscillator3.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + 0.5);
                    oscillator3.type = 'triangle';
                    
                    // Filter for more realistic sound
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
                    filter.Q.setValueAtTime(8, this.audioContext.currentTime);
                    
                    pannerNode.pan.setValueAtTime(panValue, this.audioContext.currentTime);
                    
                    // Volume envelope for roar
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.8, this.audioContext.currentTime + 0.1);
                    gainNode.gain.linearRampToValueAtTime(0.6, this.audioContext.currentTime + 0.5);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
                    
                    oscillator1.connect(filter);
                    oscillator2.connect(filter);
                    oscillator3.connect(gainNode);
                    filter.connect(gainNode);
                    gainNode.connect(pannerNode);
                    pannerNode.connect(this.audioContext.destination);
                    
                    const startTime = this.audioContext.currentTime;
                    oscillator1.start(startTime);
                    oscillator2.start(startTime);
                    oscillator3.start(startTime);
                    
                    oscillator1.stop(startTime + 1.5);
                    oscillator2.stop(startTime + 1.5);
                    oscillator3.stop(startTime + 1.5);
                };
            }
            
            async generateElephantTrumpet() {
                this.animalSounds.elephant = (panValue, gainNode) => {
                    const oscillator1 = this.audioContext.createOscillator();
                    const oscillator2 = this.audioContext.createOscillator();
                    const filter = this.audioContext.createBiquadFilter();
                    const pannerNode = this.audioContext.createStereoPanner();
                    
                    // Trumpet sound - higher frequency with modulation
                    oscillator1.frequency.setValueAtTime(200, this.audioContext.currentTime);
                    oscillator1.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
                    oscillator1.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.8);
                    oscillator1.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 1.2);
                    oscillator1.type = 'sawtooth';
                    
                    // Harmonic for richness
                    oscillator2.frequency.setValueAtTime(400, this.audioContext.currentTime);
                    oscillator2.frequency.exponentialRampToValueAtTime(1600, this.audioContext.currentTime + 0.2);
                    oscillator2.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.8);
                    oscillator2.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 1.2);
                    oscillator2.type = 'sine';
                    
                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(600, this.audioContext.currentTime);
                    filter.Q.setValueAtTime(5, this.audioContext.currentTime);
                    
                    pannerNode.pan.setValueAtTime(panValue, this.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.7, this.audioContext.currentTime + 0.05);
                    gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.3);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);
                    
                    oscillator1.connect(filter);
                    oscillator2.connect(gainNode);
                    filter.connect(gainNode);
                    gainNode.connect(pannerNode);
                    pannerNode.connect(this.audioContext.destination);
                    
                    const startTime = this.audioContext.currentTime;
                    oscillator1.start(startTime);
                    oscillator2.start(startTime);
                    
                    oscillator1.stop(startTime + 1.2);
                    oscillator2.stop(startTime + 1.2);
                };
            }
            
            async generateTigerGrowl() {
                this.animalSounds.tiger = (panValue, gainNode) => {
                    const oscillator1 = this.audioContext.createOscillator();
                    const oscillator2 = this.audioContext.createOscillator();
                    const filter = this.audioContext.createBiquadFilter();
                    const pannerNode = this.audioContext.createStereoPanner();
                    
                    // Tiger growl - lower and more menacing than lion
                    oscillator1.frequency.setValueAtTime(60, this.audioContext.currentTime);
                    oscillator1.frequency.linearRampToValueAtTime(150, this.audioContext.currentTime + 0.4);
                    oscillator1.frequency.linearRampToValueAtTime(90, this.audioContext.currentTime + 0.8);
                    oscillator1.type = 'sawtooth';
                    
                    oscillator2.frequency.setValueAtTime(120, this.audioContext.currentTime);
                    oscillator2.frequency.linearRampToValueAtTime(300, this.audioContext.currentTime + 0.4);
                    oscillator2.frequency.linearRampToValueAtTime(180, this.audioContext.currentTime + 0.8);
                    oscillator2.type = 'square';
                    
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
                    filter.Q.setValueAtTime(10, this.audioContext.currentTime);
                    
                    pannerNode.pan.setValueAtTime(panValue, this.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.9, this.audioContext.currentTime + 0.1);
                    gainNode.gain.linearRampToValueAtTime(0.7, this.audioContext.currentTime + 0.4);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
                    
                    oscillator1.connect(filter);
                    oscillator2.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(pannerNode);
                    pannerNode.connect(this.audioContext.destination);
                    
                    const startTime = this.audioContext.currentTime;
                    oscillator1.start(startTime);
                    oscillator2.start(startTime);
                    
                    oscillator1.stop(startTime + 1.0);
                    oscillator2.stop(startTime + 1.0);
                };
            }
            
            async generateBearGrowl() {
                this.animalSounds.bear = (panValue, gainNode) => {
                    const oscillator1 = this.audioContext.createOscillator();
                    const oscillator2 = this.audioContext.createOscillator();
                    const oscillator3 = this.audioContext.createOscillator();
                    const filter = this.audioContext.createBiquadFilter();
                    const pannerNode = this.audioContext.createStereoPanner();
                    
                    // Bear growl - deep and rumbly
                    oscillator1.frequency.setValueAtTime(45, this.audioContext.currentTime);
                    oscillator1.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 0.6);
                    oscillator1.frequency.linearRampToValueAtTime(55, this.audioContext.currentTime + 1.0);
                    oscillator1.type = 'sawtooth';
                    
                    oscillator2.frequency.setValueAtTime(90, this.audioContext.currentTime);
                    oscillator2.frequency.linearRampToValueAtTime(160, this.audioContext.currentTime + 0.6);
                    oscillator2.frequency.linearRampToValueAtTime(110, this.audioContext.currentTime + 1.0);
                    oscillator2.type = 'triangle';
                    
                    // Very low rumble
                    oscillator3.frequency.setValueAtTime(25, this.audioContext.currentTime);
                    oscillator3.type = 'sine';
                    
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(300, this.audioContext.currentTime);
                    filter.Q.setValueAtTime(12, this.audioContext.currentTime);
                    
                    pannerNode.pan.setValueAtTime(panValue, this.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.8, this.audioContext.currentTime + 0.2);
                    gainNode.gain.linearRampToValueAtTime(0.6, this.audioContext.currentTime + 0.6);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);
                    
                    oscillator1.connect(filter);
                    oscillator2.connect(filter);
                    oscillator3.connect(gainNode);
                    filter.connect(gainNode);
                    gainNode.connect(pannerNode);
                    pannerNode.connect(this.audioContext.destination);
                    
                    const startTime = this.audioContext.currentTime;
                    oscillator1.start(startTime);
                    oscillator2.start(startTime);
                    oscillator3.start(startTime);
                    
                    oscillator1.stop(startTime + 1.2);
                    oscillator2.stop(startTime + 1.2);
                    oscillator3.stop(startTime + 1.2);
                };
            }
            
            setupEventListeners() {
                this.startBtn.addEventListener('click', () => this.startGame());
                this.stopBtn.addEventListener('click', () => this.stopGame());
                
                this.gestureButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const direction = btn.getAttribute('data-direction');
                        this.handleGesture(direction);
                    });
                });
                
                document.addEventListener('keydown', (e) => {
                    if (!this.isPlaying) return;
                    
                    let direction = null;
                    switch(e.key) {
                        case 'ArrowUp': direction = 'up'; break;
                        case 'ArrowDown': direction = 'down'; break;
                        case 'ArrowLeft': direction = 'left'; break;
                        case 'ArrowRight': direction = 'right'; break;
                    }
                    
                    if (direction) {
                        e.preventDefault();
                        this.handleGesture(direction);
                    }
                });
            }
            
            async startGame() {
                try {
                    if (this.audioContext.state === 'suspended') {
                        await this.audioContext.resume();
                    }
                    
                    this.isPlaying = true;
                    this.score = 0;
                    this.lives = 3;
                    
                    this.startBtn.disabled = true;
                    this.stopBtn.disabled = false;
                    
                    this.updateUI();
                    this.gameStatus.textContent = "Game starting... Listen for the animals!";
                    
                    if (this.ambientSoundsCheckbox.checked) {
                        this.startAmbientSounds();
                    }
                    
                    setTimeout(() => {
                        if (this.isPlaying) {
                            this.nextChallenge();
                        }
                    }, 2000);
                    
                } catch (error) {
                    console.error('Error starting game:', error);
                    this.gameStatus.textContent = "Error: Please allow audio access and try again.";
                }
            }
            
            stopGame() {
                this.isPlaying = false;
                
                if (this.challengeTimeout) {
                    clearTimeout(this.challengeTimeout);
                }
                
                if (this.progressInterval) {
                    clearInterval(this.progressInterval);
                }
                
                if (this.ambientSource) {
                    this.ambientSource.stop();
                    this.ambientSource = null;
                }
                
                this.startBtn.disabled = false;
                this.stopBtn.disabled = true;
                this.timeProgress.style.width = '0%';
                
                this.gameStatus.textContent = `Game Over! Final Score: ${this.score}`;
            }
            
            startAmbientSounds() {
                const oscillator1 = this.audioContext.createOscillator();
                const oscillator2 = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator1.frequency.setValueAtTime(60, this.audioContext.currentTime);
                oscillator2.frequency.setValueAtTime(80, this.audioContext.currentTime);
                
                oscillator1.type = 'sine';
                oscillator2.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                
                oscillator1.connect(gainNode);
                oscillator2.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator1.start();
                oscillator2.start();
                
                this.ambientSource = { stop: () => {
                    oscillator1.stop();
                    oscillator2.stop();
                }};
                
                this.playRandomNatureSounds();
            }
            
            playRandomNatureSounds() {
                if (!this.isPlaying) return;
                
                setTimeout(() => {
                    if (this.isPlaying && this.ambientSoundsCheckbox.checked) {
                        this.playBirdChirp();
                        this.playRandomNatureSounds();
                    }
                }, Math.random() * 5000 + 3000);
            }
            
            playBirdChirp() {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }
            
            nextChallenge() {
                if (!this.isPlaying) return;
                
                const delay = Math.random() * 3000 + 2000;
                
                setTimeout(() => {
                    if (this.isPlaying) {
                        this.spawnThreat();
                    }
                }, delay);
            }
            
            spawnThreat() {
                if (!this.isPlaying) return;
                
                this.currentChallenge = this.threats[Math.floor(Math.random() * this.threats.length)];
                
                this.playDirectionalAnimalSound(this.currentChallenge);
                
                this.gameStatus.textContent = `${this.currentChallenge.description} from the ${this.currentChallenge.direction}!`;
                
                if (this.voiceGuidanceCheckbox.checked) {
                    setTimeout(() => {
                        this.speak(`${this.currentChallenge.sound} approaching from ${this.currentChallenge.direction}! Move ${this.currentChallenge.escape}!`);
                    }, 500);
                }
                
                this.timeLeft = this.maxTime;
                this.startProgressBar();
                
                this.challengeTimeout = setTimeout(() => {
                    this.missedReaction();
                }, this.maxTime);
            }
            
            playDirectionalAnimalSound(threat) {
                const gainNode = this.audioContext.createGain();
                
                let panValue = 0;
                if (threat.direction === 'left') panValue = -0.8;
                else if (threat.direction === 'right') panValue = 0.8;
                
                // Use realistic animal sounds if available and enabled
                if (this.soundsLoaded && this.realisticSoundsCheckbox.checked && this.animalSounds[threat.sound]) {
                    this.animalSounds[threat.sound](panValue, gainNode);
                } else {
                    // Fallback to original oscillator-based sounds
                    this.playFallbackSound(threat, panValue, gainNode);
                }
            }
            
            playFallbackSound(threat, panValue, gainNode) {
                const oscillator = this.audioContext.createOscillator();
                const pannerNode = this.audioContext.createStereoPanner();
                
                oscillator.frequency.setValueAtTime(threat.frequency, this.audioContext.currentTime);
                
                if (threat.sound === 'lion') {
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
                } else if (threat.sound === 'elephant') {
                    oscillator.type = 'square';
                    oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
                } else if (threat.sound === 'tiger') {
                    oscillator.type = 'sine';
                    oscillator.frequency.linearRampToValueAtTime(1500, this.audioContext.currentTime + 0.3);
                } else if (threat.sound === 'bear') {
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
                }
                
                pannerNode.pan.setValueAtTime(panValue, this.audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.6, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
                
                oscillator.connect(gainNode);
                gainNode.connect(pannerNode);
                pannerNode.connect(this.audioContext.destination);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 1);
            }
            
            speak(text) {
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.rate = 1.2;
                    utterance.volume = 0.8;
                    speechSynthesis.speak(utterance);
                }
            }
            
            startProgressBar() {
                this.progressInterval = setInterval(() => {
                    this.timeLeft -= 50;
                    const progress = Math.max(0, (this.timeLeft / this.maxTime) * 100);
                    this.timeProgress.style.width = progress + '%';
                    
                    if (this.timeLeft <= 0) {
                        clearInterval(this.progressInterval);
                    }
                }, 50);
            }
            
            handleGesture(direction) {
                if (!this.currentChallenge || !this.isPlaying) return;
                
                clearTimeout(this.challengeTimeout);
                clearInterval(this.progressInterval);
                
                if (direction === this.currentChallenge.escape) {
                    this.correctReaction();
                } else {
                    this.incorrectReaction(direction);
                }
                
                this.currentChallenge = null;
                this.timeProgress.style.width = '0%';
            }
            
            correctReaction() {
                this.score += 10;
                this.gameStatus.textContent = "Perfect escape! You're safe! +10 points";
                this.playSuccessSound();
                
                this.updateUI();
                this.nextChallenge();
            }
            
            incorrectReaction(direction) {
                this.lives--;
                this.gameStatus.textContent = `Wrong direction! The ${this.currentChallenge.sound} caught you! Lives: ${this.lives}`;
                this.playFailureSound();
                
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    this.nextChallenge();
                }
            }
            
            missedReaction() {
                this.lives--;
                this.gameStatus.textContent = `Too slow! The ${this.currentChallenge.sound} caught you! Lives: ${this.lives}`;
                this.playFailureSound();
                
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    this.nextChallenge();
                }
            }
            
            playSuccessSound() {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }
            
            playFailureSound() {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
                oscillator.type = 'sawtooth';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.5);
            }
            
            gameOver() {
                this.stopGame();
                this.speak(`Game over! Your final score is ${this.score} points.`);
            }
            
            updateUI() {
                this.scoreElement.textContent = this.score;
                this.livesElement.textContent = this.lives;
            }
        }
        
        // Initialize the game when page loads
        window.addEventListener('load', () => {
            new EnhancedAudioSurvivalGame();
        });