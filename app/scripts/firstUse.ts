import $ from 'jquery';
import { Parameters } from './parameters';

export function firstUse() {
    const doc = document.getElementById('body');
    doc.style.margin = "0";

    doc.innerHTML = "";

    const slideShowSrc = ["/first-use/merci.png", "/first-use/menu1.png", "/first-use/menu2.png", "/first-use/menu3.png", "/first-use/menu4.png", "/first-use/menu5.png", "/first-use/gooduse.png"];
    let currentSlide = 0;
    const img = document.createElement('img');
    img.src = slideShowSrc[currentSlide];
    doc.appendChild(img);
    $(img).click(() => {
        if (slideShowSrc[currentSlide + 1]) {
            currentSlide += 1;
            $(img).fadeTo(300, 0, () => {
                img.src = slideShowSrc[currentSlide];
                $(img).fadeTo(300, 1);
            })
        } else {
            window.localStorage.setItem('firstUse', 'no');
            new Parameters().setFirstUse()
                .then(() => {
                    window.close();
                })
                .catch(err => alert(err));
        }
    });
}
