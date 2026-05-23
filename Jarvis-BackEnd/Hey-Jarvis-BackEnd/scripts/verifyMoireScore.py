# scripts/verifyMoireScore.py

import cv2
import numpy as np
import sys

def calculate_moire_score(image_path):
    # Step 1: Load image in grayscale
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print("0.0")
        return

    # Step 2: Resize for consistency (optional)
    img = cv2.resize(img, (256, 256))

    # Step 3: Apply FFT
    f = np.fft.fft2(img)
    fshift = np.fft.fftshift(f)
    magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1)  # +1 avoids log(0)

    # Step 4: Analyze high frequency components
    center = 128
    band = magnitude_spectrum[center-30:center+30, center-30:center+30]
    score = np.mean(band) / 255  # Normalize to 0-1

    # Step 5: Clamp and return
    score = round(min(max(score, 0.0), 1.0), 3)
    print(score)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("0.0")
    else:
        calculate_moire_score(sys.argv[1])
