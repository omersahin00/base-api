import { timingSafeEqual } from "crypto";

/**
 * İki string'i timing attack'a karşı güvenli şekilde karşılaştırır.
 * Farklı uzunluklarda ise false döner.
 */
const safeStringCompare = (a: string, b: string): boolean => {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) {
        return false;
    }
    return timingSafeEqual(bufA, bufB);
}

export default safeStringCompare;
