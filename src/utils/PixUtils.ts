/**
 * PixUtils.ts
 *
 * Utilities for generating the PIX BR Code (EMV Co / BACEN standard).
 * Spec: https://www.bcb.gov.br/content/estabilidadefinanceira/spb_docs/ManualBRCode.pdf
 */

/** Calculates CRC-16/CCITT-FALSE (polynomial 0x1021, init 0xFFFF) */
function crc16(input: string): string {
    let crc = 0xffff;
    for (let i = 0; i < input.length; i++) {
        crc ^= input.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    return ((crc & 0xffff) >>> 0).toString(16).toUpperCase().padStart(4, "0");
}

/** Builds an EMV TLV field: ID + length(2-digit) + value */
function field(id: string, value: string): string {
    const len = String(value.length).padStart(2, "0");
    return `${id}${len}${value}`;
}

export interface PixPayloadOptions {
    pixKey: string;
    amount: number;
    receiverName?: string;
    /** Merchant city, default: "BRASIL" */
    city?: string;
    /** Transaction ID, max 25 chars, default: "***" */
    txId?: string;
    /** Description shown to payer (optional) */
    description?: string;
}

/**
 * Generates a dynamic BR Code (PIX) payload string.
 * The returned string encodes the QR Code and can also be used as "Copia e Cola".
 */
export function generatePixPayload({
    pixKey,
    amount,
    receiverName = "Presente Casamento",
    city = "BRASIL",
    txId = "***",
    description,
}: PixPayloadOptions): string {
    // Merchant Account Information (ID 26) — PIX namespace
    const pixNs = field("00", "BR.GOV.BCB.PIX");
    const pixKeyField = field("01", pixKey);
    const pixDesc = description ? field("02", description.substring(0, 72)) : "";
    const merchantInfo = field("26", pixNs + pixKeyField + pixDesc);

    // Transaction amount: two decimal places, dot separator
    const amountStr = amount.toFixed(2);

    // Additional Data (ID 62) — Transaction ID
    const txidField = field("05", txId.substring(0, 25));
    const additionalData = field("62", txidField);

    // Build payload without CRC
    const payload =
        field("00", "01") +       // Payload Format Indicator
        field("01", "12") +       // Point of Initiation: 12 = dynamic, 11 = static
        merchantInfo +             // Merchant Account Information
        field("52", "0000") +     // Merchant Category Code (generic)
        field("53", "986") +      // Transaction Currency: BRL
        field("54", amountStr) +  // Transaction Amount
        field("58", "BR") +       // Country Code
        field("59", receiverName.substring(0, 25)) +  // Merchant Name
        field("60", city.substring(0, 15)) +           // Merchant City
        additionalData +           // Additional Data Field
        "6304";                    // CRC placeholder (ID + length)

    return payload + crc16(payload);
}
