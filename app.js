class Paddel {
    constructor(width, height, posX, posY, color, speed) {
        this.width = width;
        this.height = height;
        this.posX = posX;
        this.posY = posY;
        this.color = color;
        this.speed = speed;
        this.middleHeight = height / 2;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX - this.width / 2, this.posY - this.height / 2, this.width, this.height);
    }

    move(canvas) {
        document.addEventListener("keydown", (e) => {
            e.keyCode === 38 ? this.posY -= this.speed : this.posY;
            e.keyCode === 40 ? this.posY += this.speed : this.posY;
            if (this.posY + this.height >= canvas.height) {
                this.posY = canvas.height - this.height;
            } else if (this.posY <= 0) {
                this.posY = 0;
            }
        })
    }

    aI(ballP) {
        if (this.posY <= ballP - this.middleHeight) {
            this.posY = this.posY + this.speed;
        } else if (this.posY >= ballP + this.middleHeight) {
            this.posY = this.posY - this.speed;
        }
    }
}

class Ball extends Paddel {
    constructor(width, height, posX, posY, color, speed) {
        super(width, height, posX, posY, color, speed);
        this.directionX = true; // right
        this.directionY = true; // down
        // superShot
        this.superShotValue = 0;
        // counters
        this.pCounter = 0;
        this.cCounter = 0;
        this.pScore = document.getElementById("playerScore");
        this.cScore = document.getElementById("computerScore");
    }

    move(canvas) {
        this.directionX ? this.posX += this.speed : (this.posX -= this.speed);
        this.directionY ? this.posY += this.speed : (this.posY -= this.speed);

        if (this.posX + this.width / 2 >= canvas.width) {
            this.directionX = !this.directionX; // left
            this.pCounter++;
            this.pScore.textContent = `${this.pCounter}`;
            this.posX = canvas.width / 2;
            // win condition
            if (this.pCounter == 3) {
                this.pCounter = 0;
                this.cCounter = 0;

                alert("you win!");
                this.pScore.textContent = `${this.pCounter}`;
                this.cScore.textContent = `${this.cCounter}`;
            }

        } else if (this.posX <= 0) {
            this.directionX = !this.directionX; // right
            this.cCounter++;
            this.cScore.textContent = `${this.cCounter}`;
            this.posX = canvas.width / 2;
            // lose condition
            if (this.cCounter == 3) {
                this.cCounter = 0;
                this.pCounter = 0;

                alert("you lose!")
                this.pScore.textContent = `${this.pCounter}`;
                this.cScore.textContent = `${this.cCounter}`;
            }

        }
        if (this.posY + this.height >= canvas.height) {
            this.directionY = !this.directionY // up
        } else if (this.posY - this.height <= 0) {
            this.directionY = !this.directionY //down
        }
    }

    collision(paddel1PosX, paddel1PosY, paddel1Width, paddel1Height, paddel2PosX, paddel2PosY, paddel2Width, paddel2Height) {
        if ((this.posX >= paddel1PosX && this.posX <= paddel1PosX + paddel1Width) && (this.posY + this.height >= paddel1PosY - paddel1Height && this.posY <= paddel1PosY + paddel1Height)) {
            this.directionX = !this.directionX;
            this.superShotValue++;
        } else if ((this.posX >= paddel2PosX && this.posX <= paddel2PosX + paddel2Width) && (this.posY + this.height >= paddel2PosY - paddel2Height && this.posY <= paddel2PosY + paddel2Height)) {
            this.directionX = !this.directionX;
            this.superShotValue++;
        }
    }
}

const game = {
    init() {
        // canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        // 
        // resize adjustments
        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        })
        // 

        // objects
        const paddel1 = new Paddel(10, 50, canvas.width - (canvas.width * .9), canvas.height / 2, "black", 10);
        const paddel2 = new Paddel(10, 50, canvas.width - (canvas.width * .1), canvas.height / 2, "red", 6);
        const ball1 = new Ball(10, 10, canvas.width / 2, canvas.height / 2, "black", 6);

        const objects = [];
        objects.push(paddel1, paddel2, ball1);
        // 
        paddel1.move(canvas);

        // draw objects // RAF

        const run = () => {
            ctx.fillStyle = "gray";
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            paddel2.aI(ball1.posY);
            if (ball1.superShotValue >= 2) {
                h1.style.color = `${randomizeColor()}`;
                document.body.appendChild(h1);
            }
            ball1.move(canvas);
            ball1.collision(paddel1.posX, paddel1.posY, paddel1.width, paddel1.height, paddel2.posX, paddel2.posY, paddel2.width, paddel2.height);
            objects.forEach(obj => obj.draw(ctx));
            window.requestAnimationFrame(run);

        }
        window.requestAnimationFrame(run);

        // random Colors generator
        const randomizeColor = () => {
            let randColor = `#${Math.random().toString(16).substr(-6)}`;
            return randColor
        }

        // superShot notification
        const h1 = document.createElement("h1");
        h1.classList.add("superShot");
        h1.textContent = `Press enter to Super Shot!`;
        h1.style.color = `${randomizeColor()}`;


        // checking for superShot
        document.addEventListener("keydown", (e) => {
            if (ball1.superShotValue >= 2 && e.keyCode == 13) {
                let changeColorInterv = setInterval(() => {
                    ball1.color = `${randomizeColor()}`
                }, 100);

                ball1.superShotValue = 0;
                ball1.speed += 2;
                setTimeout(() => {
                    ball1.speed -= 2;
                    clearInterval(changeColorInterv);
                    ball1.color = "black";
                }, 2000)
                document.body.removeChild(h1);
            }
        });
    }

}

game.init();