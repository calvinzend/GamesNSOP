document.addEventListener('DOMContentLoaded', function() {
    const digits = document.querySelectorAll('.code-digit');
    console.log(digits);
    const submitBtn = document.getElementById('submitBtn');
    const backBtn = document.getElementById('backBtn');
    const treasureChest = document.getElementById('treasureChest');
    const chestLid = document.getElementById('chestLid');
    const chestContent = document.getElementById('chestContent');
    const moai = document.getElementById('moai');
    const glitterEffect = document.getElementById('glitterEffect');
    const runeContainer = document.getElementById('runes');

    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const modalBlurBg = document.getElementById('modalBlurBg');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const modalBlurBgSuccess = document.getElementById('modalBlurBgSuccess');

    const codeInput = document.querySelector('.code-input');

    // Blur effect untuk error modal
    document.getElementById('errorModal').addEventListener('show.bs.modal', function () {
        modalBlurBg.classList.add('active');
    });
    document.getElementById('errorModal').addEventListener('hidden.bs.modal', function () {
        modalBlurBg.classList.remove('active');
    });

    // Blur effect untuk success modal + buka chest setelah modal ditutup
    document.getElementById('successModal').addEventListener('show.bs.modal', function () {
        modalBlurBgSuccess.classList.add('active');
    });
    document.getElementById('successModal').addEventListener('hidden.bs.modal', function () {
        modalBlurBgSuccess.classList.remove('active');
        unlockChest();
    });

    // Pindah otomatis ke input berikutnya
    digits.forEach((digit, index) => {
        digit.addEventListener('input', () => {
            if (digit.value.length === 2 && index < digits.length - 1) {
                digits[index + 1].focus();
            }
        });

        digit.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && digit.value.length === 0 && index > 0) {
                digits[index - 1].focus();
            }
        });
    });

    // Tombol submit
    submitBtn.addEventListener('click', function() {
        if (submitBtn.dataset.state === 'back') {
            resetChest();
        } else {
            checkCode();
        }
    });

    // Tombol back
    backBtn.addEventListener('click', resetChest);

    // Enter di input terakhir
    digits[digits.length - 1].addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            checkCode();
        }
    });

    function checkCode() {
        let enteredCode = '';
        digits.forEach(digit => enteredCode += digit.value);

        if (enteredCode === '12345678') {
            successModal.show();
        } else {
            treasureChest.classList.add('shake');
            setTimeout(() => treasureChest.classList.remove('shake'), 500);
            errorModal.show();
            digits.forEach(digit => digit.value = '');
            digits[0].focus();
        }
    }

    function unlockChest() {
        codeInput.style.display = 'none';

        // Hilangkan rune dengan animasi, JANGAN dihapus dari DOM!
        runeContainer.style.transition = 'opacity 0.5s ease';
        runeContainer.style.opacity = '0';

        // Tampilkan moai
        moai.style.transition = 'opacity 0.5s, transform 0.5s';
        moai.style.opacity = '1';
        moai.style.transform = 'scale(1)';

        // Efek glitter
        glitterEffect.style.transition = 'opacity 0.2s ease';
        glitterEffect.style.opacity = '1';
        setTimeout(() => {
            glitterEffect.style.opacity = '0';
            glitterEffect.style.transition = 'opacity 1.5s ease';
            glitterEffect.style.background = 'radial-gradient(circle, transparent 0%, rgba(255, 215, 0, 0.2) 100%)';
            glitterEffect.style.opacity = '1';
            setTimeout(() => {
                glitterEffect.style.opacity = '0';
            }, 1500);
        }, 200);

        createSparkles();

        // Animasi buka chest
        setTimeout(() => {
            chestLid.style.transform = 'rotateX(180deg)';
            setTimeout(() => {
                chestContent.style.opacity = '1';
                submitBtn.dataset.state = 'back';
                submitBtn.textContent = 'Back';
                backBtn.style.display = 'none';
            }, 500);
        }, 500);
    }

    function resetChest() {
        chestLid.style.transform = 'rotateX(0deg)';
        chestContent.style.opacity = '1';

        // Tampilkan runes lagi
        runeContainer.style.transition = 'opacity 0.5s ease';
        runeContainer.style.opacity = '1';

        // Hilangkan moai
        moai.style.transition = 'opacity 0.5s, transform 0.5s';
        moai.style.opacity = '0';
        moai.style.transform = 'scale(0.7)';

        backBtn.style.display = 'none';
        submitBtn.dataset.state = 'submit';
        submitBtn.textContent = 'Unlock Chest';
        codeInput.style.display = 'flex';
        digits.forEach(digit => digit.value = '');
        digits[0].focus();
    }

    function createSparkles() {
        for (let i = 0; i < 50; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.width = `${Math.random() * 10 + 5}px`;
            sparkle.style.height = sparkle.style.width;
            document.body.appendChild(sparkle);

            const animationDuration = Math.random() * 1000 + 500;
            sparkle.style.transition = `all ${animationDuration}ms ease`;
            sparkle.style.opacity = '1';
            sparkle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${Math.random() + 0.5})`;

            setTimeout(() => {
                sparkle.style.opacity = '0';
                setTimeout(() => sparkle.remove(), animationDuration);
            }, 50);
        }
    }

    // Fitur drag untuk liquid glass success
    const liquidGlass = document.getElementById('liquidGlassSuccess');
    let isDragging = false, currentX = 0, currentY = 0, initialX = 0, initialY = 0, xOffset = 0, yOffset = 0;

    if (liquidGlass) {
        liquidGlass.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;

        liquidGlass.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        liquidGlass.addEventListener('touchstart', dragStart);
        document.addEventListener('touchmove', dragMove);
        document.addEventListener('touchend', dragEnd);
    }

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === liquidGlass) {
            isDragging = true;
            liquidGlass.classList.add('dragging');
        }
    }

    function dragMove(e) {
        if (isDragging) {
            e.preventDefault();
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, liquidGlass);
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        liquidGlass.classList.remove('dragging');
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
});