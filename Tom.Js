<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Stickman with Personality</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: #87ceeb; /* Sky Blue */
        }
        canvas {
            display: block;
            background-color: #c1e0ff; /* Light Blue background for canvas */
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    
    <script>
        // Setup canvas
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Responsive setup
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (stickFigure) {
                stickFigure.x = canvas.width / 2;
                stickFigure.y = canvas.height - stickFigure.figureHeight - 50;
            }
        }
        window.addEventListener('resize', resizeCanvas);

        // Stick figure settings
        let stickFigure;

        // Mouse interactions
        let mouseX = 0;
        let mouseY = 0;
        let isMouseHovering = false;
        let randomMessage = 'Hi';
        const hoverInterval = 1000;
        let lastHoverTime = 0;

        // Personality traits and dictionaries
        const traits = {
            philosophical: [
                "What is the meaning of 'Me'?",
                "I think, therefore I stick.",
                "Do you believe we live in a simulation?",
                "Is power an illusion, or is the illusion power itself?"
            ],
            degenerateTrader: [
                "Diamond hands, baby!",
                "Buy high, sell higher.",
                "My portfolio is down 99%, but it's not a loss if I don't sell.",
                "To the moon!"
            ],
            theological: [
                "Am I the chosen stick?",
                "Do sticks have souls?",
                "Let us pray to the almighty tree.",
                "I wonder if I can ascend to the heavens."
            ],
            ambitious: [
                "I will rule the stick world!",
                "Power is my birthright.",
                "All shall kneel before me.",
                "I will be the most powerful man alive."
            ]
        };

        // Randomly combine a sentence influenced by traits
        function generateSentence() {
            const categories = Object.keys(traits);
            const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
            const possibleResponses = traits[selectedCategory];
            const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
            return response;
        }

        // Stick figure class with responsive adjustments
        class StickFigure {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.figureHeight = Math.min(120, canvas.height / 8); // Dynamic height
                this.figureWidth = this.figureHeight * 0.375; // Maintain proportions
                this.direction = Math.random() < 0.5 ? 1 : -1;
                this.step = 0;
                this.walkingSpeed = Math.max(canvas.width / 1000, 1); // Speed slows down on larger screens
                this.stopTime = Math.floor(Math.random() * 100) + 100;
                this.stopCounter = 0;
                this.isWaving = false;
            }

            draw() {
                const legSwing = Math.sin(this.step / 10) * (this.figureWidth / 2);
                const armSwing = Math.sin(this.step / 10) * (this.figureWidth / 2);

                // Body
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.figureHeight);
                ctx.stroke();

                // Legs
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + this.figureHeight);
                ctx.lineTo(this.x - this.figureWidth + legSwing, this.y + this.figureHeight + this.figureHeight / 4);
                ctx.moveTo(this.x, this.y + this.figureHeight);
                ctx.lineTo(this.x + this.figureWidth - legSwing, this.y + this.figureHeight + this.figureHeight / 4);
                ctx.stroke();

                // Arms
                ctx.beginPath();
                if (this.isWaving) {
                    ctx.moveTo(this.x - this.figureWidth, this.y + this.figureHeight / 2);
                    ctx.lineTo(this.x + this.figureWidth * 2, this.y + this.figureHeight / 2);
                } else {
                    ctx.moveTo(this.x - this.figureWidth, this.y + this.figureHeight / 2);
                    ctx.lineTo(this.x + this.figureWidth + armSwing, this.y + this.figureHeight / 2);
                }
                ctx.stroke();

                // Head
                ctx.beginPath();
                ctx.arc(this.x, this.y - this.figureHeight / 3, this.figureWidth, 0, Math.PI * 2, false); // Adjusted head position
                ctx.stroke();

                // Speech bubble when hovering
                if (isMouseHovering) {
                    ctx.font = "16px Arial";
                    const textWidth = ctx.measureText(randomMessage).width;
                    const bubblePadding = 10;

                    // Draw speech bubble
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(this.x - 40, this.y - this.figureHeight, textWidth + bubblePadding * 2, 50);
                    ctx.fillStyle = "#000000";
                    ctx.fillText(randomMessage, this.x - 20, this.y - this.figureHeight + 20);
                }

                // Draw the green diamond icon above the stick figure's head
                const diamondSize = this.figureWidth * 0.8; // Diamond size scales
                const diamondX = this.x;
                const diamondY = this.y - this.figureHeight - diamondSize;

                ctx.fillStyle = '#32CD32'; // Green color
                ctx.beginPath();
                ctx.moveTo(diamondX, diamondY - diamondSize / 2);
                ctx.lineTo(diamondX + diamondSize / 2, diamondY);
                ctx.lineTo(diamondX, diamondY + diamondSize / 2);
                ctx.lineTo(diamondX - diamondSize / 2, diamondY);
                ctx.closePath();
                ctx.fill();

                // Check if the mouse is over the diamond
                if (mouseX > diamondX - diamondSize / 2 && mouseX < diamondX + diamondSize / 2 &&
                    mouseY > diamondY - diamondSize / 2 && mouseY < diamondY + diamondSize / 2) {
                    canvas.style.cursor = 'pointer';
                } else {
                    canvas.style.cursor = 'default';
                }
            }

            move() {
                this.step += 1;
                if (this.step > 20) this.step = 0;

                if (this.stopCounter > this.stopTime) {
                    this.direction *= -1;
                    this.stopTime = Math.floor(Math.random() * 100) + 100;
                    this.stopCounter = 0;
                }

                this.x += this.direction * this.walkingSpeed;
                this.stopCounter++;

                if (this.x < 0) this.x = 0;
                if (this.x > canvas.width) this.x = canvas.width;

                if (isMouseHovering) {
                    this.isWaving = true;
                    this.walkingSpeed = 0;
                } else {
                    this.isWaving = false;
                    this.walkingSpeed = Math.max(canvas.width / 1000, 1);
                }
            }
        }

        // Create the stick figure
        function createFigure() {
            stickFigure = new StickFigure(canvas.width / 2, canvas.height - 120);
        }

        // Handle mouse movements
        function handleMouseMove(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;

            const distX = mouseX - stickFigure.x;
            const distY = mouseY - stickFigure.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const currentTime = Date.now();

            if (distance < stickFigure.figureWidth + 30) {
                isMouseHovering = true;

                if (currentTime - lastHoverTime > hoverInterval) {
                    randomMessage = generateSentence();
                    lastHoverTime = currentTime;
                }
            } else {
                isMouseHovering = false;
            }
        }

        // Handle mouse clicks
        function handleMouseClick() {
            const diamondSize = stickFigure.figureWidth * 0.8;
            const diamondX = stickFigure.x;
            const diamondY = stickFigure.y - stickFigure.figureHeight - diamondSize;

            if (mouseX > diamondX - diamondSize / 2 && mouseX < diamondX + diamondSize / 2 &&
                mouseY > diamondY - diamondSize / 2 && mouseY < diamondY + diamondSize / 2) {
                window.open('https://x.com/Tom_stickverse', '_blank');
            }
        }

        // Update animation
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#228B22";
            ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

            stickFigure.move();
            stickFigure.draw();

            requestAnimationFrame(animate);
        }

        // Initialize
        resizeCanvas();
        createFigure();
        animate();

        // Add event listeners for resizing, mouse movement, and clicks
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleMouseClick);
    </script>
</body>
</html>
