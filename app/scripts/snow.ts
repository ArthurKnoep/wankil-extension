import $ from 'jquery';

interface Flake {
    x: number,
    y: number,
    xrange: number,
    yspeed: number,
    life: number,
    size: number,
    html: HTMLElement
}

export class Snow {
    private readonly wind: number;
    private readonly maxXrange: number;
    private readonly minXrange: number;
    private readonly maxSpeed: number;
    private readonly minSpeed: number;
    private readonly color: string;
    private readonly char: string;
    private readonly maxSize: number;
    private readonly minSize: number;

    private readonly flakes: Flake[]
    private WIDTH: number;
    private HEIGHT: number;

    constructor() {
        this.wind = 0;
        this.maxXrange = 100;
        this.minXrange = 10;
        this.maxSpeed = 1.5;
        this.minSpeed = 0.5;
        this.color = "#fff";
        this.char = "*";
        this.maxSize = 30;
        this.minSize = 15;

        this.flakes = [];
        this.WIDTH = 0;
        this.HEIGHT = 0;
    }

    public start() {
        $("body").css("background", "-webkit-linear-gradient(top, #3f4c6b 0%,#224 100%")
            .css("background-color", "-webkit-linear-gradient(top, #3f4c6b 0%,#224 100%");
        $("#status").css("background-color", "rgba(63, 81, 181, 0.5)")
            .css("z-index", "500");
        $(".openInfo").css("border", "2px solid rgba(255, 255, 255, 0.45)")
            .css("color", "rgba(255, 255, 255, 0.6)");
        $("span").css("z-index", "500");
        this.init(20);
    }

    private getSize() {
        this.WIDTH = document.body.clientWidth || window.innerWidth;
        this.HEIGHT = document.body.clientHeight || window.innerHeight;
    }

    private random(range: number, normal?: number): number {
        const num = normal ? normal : 1;
        return Math.floor(Math.random() * (range + 1) * num) / num;
    }

    private animate() {
        for(let i = 0, c = this.flakes.length; i < c; i++){
            const flake = this.flakes[i];
            const top = flake.y + flake.yspeed;
            const left = flake.x + Math.sin(flake.life) * flake.xrange + this.wind;
            if(top < this.HEIGHT - flake.size - 10 && left < this.WIDTH - flake.size && left > 0){
                flake.html.style.top = top + "px";
                flake.html.style.left = left + "px";
                flake.y = top;
                flake.x += this.wind;
                flake.life += .01;
            } else {
                flake.html.style.top = -this.maxSize + "px";
                flake.x = this.random(this.WIDTH);
                flake.y = -this.maxSize;
                flake.html.style.left = flake.x + "px";
                flake.life = 0;
            }
        }
        setTimeout(() => {
            this.animate();
        }, 20);
    }

    private init(flakeCount: number) {
        const frag = document.createDocumentFragment();
        this.getSize();

        for (let i = 0; i < flakeCount; i++) {
            const flake: Flake = {
                html: document.createElement("span"),
                life: 0,
                size: this.minSize + this.random(this.maxSize - this.minSize),
                x: this.random(this.WIDTH),
                xrange: this.minXrange + this.random(this.maxXrange - this.minXrange),
                y: -this.maxSize,
                yspeed: this.minSpeed + this.random(this.maxSpeed - this.minSpeed, 100)
            };
            flake.html.style.position = "absolute";
            flake.html.style.zIndex = "-1";
            flake.html.style.top = flake.y + "px";
            flake.html.style.left = flake.x + "px";
            flake.html.style.fontSize = flake.size + "px";
            flake.html.style.color = this.color;
            flake.html.appendChild(document.createTextNode(this.char));
            frag.appendChild(flake.html);
            this.flakes.push(flake);
        }
        document.body.appendChild(frag);
        this.animate();
    }
}
