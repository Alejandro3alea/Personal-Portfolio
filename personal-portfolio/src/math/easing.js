export function Lerp(lhs, rhs, tVal) {
    return lhs + (rhs - lhs) * tVal;
}

export function EaseIn(lhs, rhs, tVal) {
    const easeT = tVal * tVal;
    return Lerp(lhs, rhs, easeT);
}

export function EaseOut(lhs, rhs, tVal) {
    const easeT = 1.0 - (1.0 - tVal) * (1.0 - tVal);
    return Lerp(lhs, rhs, easeT);
}

export function EaseInOut(lhs, rhs, tVal) {
    if (tVal < 0.5) {
        const easeT = 2.0 * tVal * tVal;
        return Lerp(lhs, rhs, easeT);
    }
    else {
        const easeT = 1.0 - 2.0 * (1.0 - tVal) * (1.0 - tVal);
        return Lerp(lhs, rhs, easeT);
    }
}

// From https://easings.net/
export function EaseInBack(lhs, rhs, tVal) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    const easeT = c3 * tVal * tVal * tVal - c1 * tVal * tVal;
    return Lerp(lhs, rhs, easeT);
}

// From https://easings.net/
export function EaseOutBack(lhs, rhs, tVal) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    
    const easeT = 1 + c3 * Math.pow(tVal - 1, 3) + c1 * Math.pow(tVal - 1, 2);
    return Lerp(lhs, rhs, easeT);
}

// From https://easings.net/
export function EaseInOutBack(lhs, rhs, tVal) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    if (tVal < 0.5) {
        const easeT = (Math.pow(2 * tVal, 2) * ((c2 + 1) * 2 * tVal - c2)) / 2;
        return Lerp(lhs, rhs, easeT);
    }
    else {
        const easeT = (Math.pow(2 * tVal - 2, 2) * ((c2 + 1) * (tVal * 2 - 2) + c2) + 2) / 2;
        return Lerp(lhs, rhs, easeT);
    }
}

export function QuadraticBounce(lhs, rhs, tVal) {
    const easeT = -4.0 * tVal * tVal + 4.0 * tVal;
    return Lerp(lhs, rhs, easeT);
}