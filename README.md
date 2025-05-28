# Cryptographic Application
CSAC 329 - Applied Cryptography | May 25, 2025

## Group Members:
- Carl Cyruz Leonador
- Trixie Kathleen Zabala
- Vohn Tibi Ayuban

# Introduction
The final project for our course named Applied Cryptography is a cryptographic application that allows the user to make use of a selected number of cryptographic algorithms and functions based on its main functionality.

This web application gives the user the ability to make use of symmetric algorithms, asymmetric algorithms, and hashing functions, of which they can use for their cryptographic needs. Cryptography is the science of encoding and decoding messages to protect their confidentiality, integrity, and authenticity. It allows the user to have a secure conversation and connection between its recipient and its sender.

# Project Objectives
This project exists to be able to attain the following goals or objectives:
1. Allow users to explore and use the algorithms and functions that are (and was) in use within the world of secure and encrypted digital data.
2. Educate the user with a brief summary of the importance and legacy of each of the algorithms and functions used in the project.
3. Encourage young and aspiring cryptologists, security experts, and app developers to make use and explore cryptography for their security-related needs.

# Discussions

YouTube Discussion link: Will be provided

## Application architecture and UI
The web application is created with Flask using Python 3.10+. The backend of the web application is simplified to have general processes be separate modules, such as symmetric algorithms being in a separate Python module.

The frontend of the web application is rendered with Jinja2 template blocks for easier UI creation. Self-made JavaScript files and Cascading Style Sheets (CSS) files were implemented for specific needs. A specific CSS file, named `rw.css` is a modified version of Henpemaz's version; this CSS file was originally made for an online interactive map for the game "Rain World".

The UI makes use of this CSS file, which is based off and inspired from the game "Rain World" by Videocult. Some of the graphics used are based of said game.

## Implemented cryptographic algorithms
### Data Encryption Standard (DES) [Symmetric Algorithm]
Developed by IBM, initally named as "Lucifer", DES was adopted by NIST in 1977. It was widely used before being deemed insecure due to short key size (56 bits).

```
Input: 64-bit plaintext, 56-bit key
Apply Initial Permutation (IP)
For 16 rounds:
    Divide data into left and right halves
    Apply Feistel function on right half
    XOR with left half
    Swap halves
Apply Final Permutation (FP)
Output: 64-bit ciphertext
```

`pycryptodome` was used for its implementation.

It is implemented using the Electronic Codebook mode. It is then used via a convenience function for the main app backend module. The frontend JavaScript file for the symmetric algorithms executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Encrypted data will be a Base64 encoded string which can either be copied or downloaded; otherwise, decrypted files are sent in Base64 encoding while decrypted text are sent as is.

### Advanced Encryption Standard (DES) [Symmetric Algorithm]
Developed by Vincent Rijmen and Joan Daemen (Rijndael), it was later adopted by NIST in 2001. It replaces the insecure DES algorithm.

```
Input: 128-bit plaintext, 128/192/256-bit key
AddRoundKey
For Nr-1 rounds:
    SubBytes
    ShiftRows
    MixColumns
    AddRoundKey
Final Round:
    SubBytes
    ShiftRows
    AddRoundKey
Output: 128-bit ciphertext
```

`pycryptodome` was used for its implementation.

It is implemented using the Cipher Block Chaining mode with an Initialization Vector included. It is then used via a convenience function for the main app backend module. The frontend JavaScript file for the symmetric algorithms executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Encrypted data will be a Base64 encoded string which can either be copied or downloaded; otherwise, decrypted files are sent in Base64 encoding while decrypted text are sent as is.

### Blowfish [Symmetric Algorithm]
Developed by Bruce Schneier in 1993 as a free alternative to DES due to rising demands vs patented propriety algorithms.

```
Input: 64-bit plaintext, variable key (32–448 bits)
Divide into two 32-bit halves
For 16 rounds:
    Left = Left XOR P[i]
    Right = F(Left) XOR Right
    Swap
Undo last swap, then:
Right = Right XOR P[17]
Left = Left XOR P[18]
Output: Ciphertext
```

`pycryptodome` was used for its implementation.

It is implemented the same as AES, and is then used via a convenience function for the main app backend module. The frontend JavaScript file for the symmetric algorithms executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Encrypted data will be a Base64 encoded string which can either be copied or downloaded; otherwise, decrypted files are sent in Base64 encoding while decrypted text are sent as is.

### Internation Data Encryption Standard (IDEA) [Symmetric Algorithm]
Developed in 1991 by Xuejia Lai and James Massey, it was developed as a successor to DES.

```
Input: 64-bit block, 128-bit key
For 8 rounds:
    Apply a mix of XOR, addition mod 2^16, and multiplication mod 2^16+1
Final Transformation
Output: Ciphertext
```

`pyca/cryptography` was used for its implementation. It is considered a decrepit cipher by the library and is included for legacy purposes.

It is implemented the same as AES, and is then used via a convenience function for the main app backend module. The frontend JavaScript file for the symmetric algorithms executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Encrypted data will be a Base64 encoded string which can either be copied or downloaded; otherwise, decrypted files are sent in Base64 encoding while decrypted text are sent as is.

### Rivest-Shamir-Adleman (RSA) [Asymmetric Algorithm]
Introduced in 1997 by Rivest, Shamir, and Adleman, it has been used for signing digital signatures, securing key exchanges, and HTTPS.

```
KeyGen:
    Choose primes p and q
    n = p * q
    φ(n) = (p-1)*(q-1)
    Choose e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
    Compute d ≡ e⁻¹ mod φ(n)
    Public Key: (e, n), Private Key: (d, n)

Encryption: C = M^e mod n
Decryption: M = C^d mod n
```

`pycryptodome` was used for its implementation.

It is implemented through the use of a hybrid implementation of RSA and AES encryption. It also makes use of PKCS#1-OAEP for signing the session key for AES encryption/decryption. Keys are generated with a key length of 2048, exported in PEM format. Keys are retrived via its endpoint.

Its convenience function is then used for the main app backend module. The frontend JavaScript file for the asymmetric algorithms executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Encrypted data will be a Base64 encoded string which can either be copied or downloaded; otherwise, decrypted files are sent in Base64 encoding while decrypted text are sent as is.

### Elliptic Curve Cryptography (ECC) [Asymmetric Algorithm]
Proposed independently by Miller and Koblitz in 1985, it has been used for TLS/SSL, Bitcoin, and in mobile devices for securing information and connections. As its name suggests, it makes use of specific elliptic curves in a finite field for securing information.

```
KeyGen:
    Choose elliptic curve E over field F_p
    Select base point G
    Choose private key d
    Compute public key Q = dG

Encryption:
    Choose random k
    Ciphertext = (kG, P + kQ)

Decryption:
    M = P + kQ - d(kG)
```

`sslcrypto` was used for its implementation.

It is implemented by making use of the `secp521r1` elliptic curve. This curve is then used for generating its keys, and for encryption and decryption processes. Its encryption process makes use of AES-256 in CBC mode.

Its convenience function is then used for the main app backend module. The frontend JavaScript file for the asymmetric algorithms executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Encrypted data will be a Base64 encoded string which can either be copied or downloaded; otherwise, decrypted files are sent in Base64 encoding while decrypted text are sent as is.

### Secure Hashing Algorithm-1 (SHA-1) [Hashing Function]
Developed by NSA, published by NIST in 1995. It is now considered insecure and is now decrepated for use. It was used for legacy systems, Git source control, and SSL.

```
Input: Message M
Preprocess: pad M, parse into 512-bit blocks
Initialize H0...H4
For each block:
    Expand to 80 words
    Perform 80 rounds of operations using functions (f) and constants (K)
Output: 160-bit digest
```

`hashlib` was used for its implementation.

It is implemented by simply creating an instance of it, updating its value with the input data, and retrieving its hex digested output.

Its convenience function is then used for the main app backend module. The frontend JavaScript file for the hashing functions executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Hashed data are sent back as is.

### Secure Hashing Algorithm-2 (SHA-2) [Hashing Function]
Published in 2001 by NIST to address issues on and succeed SHA-1, it is now used for signing digital signatures, TLS, blockchain, and password hashing.

```
Input: Message M
Pad M to multiple of 512 bits
Initialize 8 hash values (H0-H7)
For each block:
    Prepare message schedule (64 words)
    For 64 rounds:
        Apply compression function with bitwise ops and constants

Output: 256-bit digest
```

`hashlib` was used for its implementation.

It is implemented by simply creating an instance of it, specifically the 256-bit instance, updating its value with the input data, and retrieving its hex digested output.

Its convenience function is then used for the main app backend module. The frontend JavaScript file for the hashing functions executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Hashed data are sent back as is.

### Secure Hashing Algorithm-3 (SHA-3) [Hashing Function]
Developed by Guido Betoni et al. during the NIST SHA-3 competition in 2012, has been standardized in FIPS PUB 202 in August 2015. However, this does not directly improves SHA-2 and was meant as an alternative for SHA-2 just in case it becomes insecure or broken. It has been used for general hashing and integrity checking, cryptography protocols like blockchain and digital signatures, and in customizable functions.

```
Input: Message M, Length L
Rate: 1152 if L == 224, 1088 if L == 256, 382 if L == 384, 576 if L == 512
Capcity: 1600 - Rate
Preprocess: pad M with SHA-3 padding
Initialize State to zero of 1600 bits
For each block in padded M split into Rate-bit chunks:
    Update state with XOR of the block
    Perform Keccak_F1600 on State

Initialize Output
While Output length < L:
    Append State to Output
    If more output is needed:
        Perform Keccak_F1600 on State

Output: First L bits of Output
```

`hashlib` was used for its implementation.

It is implemented by simply creating an instance of it, updating its value with the input data, and retrieving its hex digested output.

Its convenience function is then used for the main app backend module. The frontend JavaScript file for the hashing functions executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Hashed data are sent back as is.

### Message Digest-5 (MD5) [Hashing Function]
Created by Ronald Rives in 1992 to address issues and succeed MD4, it was later considered cryptographically broken due to collision vulnerabilities. It was used for checksums and legacy digital signatures.

```
Input: Message M
Pad M to 512-bit blocks
Initialize 4-word state (A, B, C, D)
For each block:
    Perform 64 operations using nonlinear functions and constants

Output: 128-bit hash
```

`hashlib` was used for its implementation.

It is implemented by simply creating an instance of it, updating its value with the input data, and retrieving its hex digested output.

Its convenience function is then used for the main app backend module. The frontend JavaScript file for the hashing functions executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Hashed data are sent back as is.

### BLAKE2 [Hashing Function]
Released in 2012 by Jean-Philippe Aumasson et al. to succeed BLAKE, it is used for modern applications requiring fast, secure hashing such as passwords and file integrity.

```
Input: Message M, optional key, salt, etc.
Initialize state vectors from IV and parameters
Divide input into 128-byte blocks
Use compression function based on ChaCha

Output: Configurable length hash
```

`hashlib` was used for its implementation.

It is implemented by simply creating an instance of it, updating its value with the input data, and retrieving its hex digested output.

Its convenience function is then used for the main app backend module. The frontend JavaScript file for the hashing functions executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Hashed data are sent back as is.

### GOST R 34.11-2012 [Hashing Function]
Published by the Federal Security Service (FSB) of Russia in 2012, also known as Stribog (named after a Slavic deity of wind), it replaces the GOST R 34.11-94 standard. It is mostly used for Russian government use, and general hashing uses.

```
Input: Message M
Break into 256-bit blocks
For each block:
    Update checksum
    Use internal cipher to compress
Finalize using hash state and checksum

Output: 256-bit hash
```

`gostcrypto` was used for its implementation.

It is implemented by simply creating an instance of a `gosthash` object using the hashing algorithm name `streebog512`, updating its value with the input data, and retrieving its hex digested output.

Its convenience function is then used for the main app backend module. The frontend JavaScript file for the hashing functions executes an asynchronous function to send the input form and receive the output via a POST request to its endpoint. File inputs are first encoded to Base64 before being sent to the server; text inputs are sent as is. Hashed data are sent back as is.

# Sample Runs/Outputs:
## Symmetric Algorithms
### Data Encryption Standard (DES)

| MODE | INPUT | OUTPUT |
| ---- | ------- | -------- |
| ENCRYPT (TEXT) | ![text-input-des](/sample_runs/DES/des_text_encrypt1.PNG "Encrypt text using DES") | ![text-output-des](/sample_runs/DES/des_text_encrypt2.PNG "Encrypted text using DES") |
| ENCRYPT (FILE) | ![file-input-des](/sample_runs/DES/des_file_encrypt1.PNG "Encrypt file using DES") | ![file-output-des](/sample_runs/DES/des_file_encrypt2.PNG "Encrypted file using DES") |
| DECRYPT (TEXT) | ![text-input-des](/sample_runs/DES/des_text_decrypt1.PNG "Decrypt ciphertext using DES") | ![text-output-des](/sample_runs/DES/des_text_decrypt2.PNG "Decrypted text using DES") |
| DECRYPT (FILE) | ![file-input-des](/sample_runs/DES/des_file_decrypt1.PNG "Decrypt encrypted file using DES") | ![file-output-des](/sample_runs/DES/des_file_decrypt2.PNG "Decrypted file using DES") |


### Advanced Encryption Standard (AES)
| MODE | INPUT | OUTPUT |
| ---- | ------- | -------- |
| ENCRYPT (TEXT) | ![text-input-aes](/sample_runs/AES/aes_text_encrypt1.png "Encrypt text using AES") | ![text-output-aes](/sample_runs/AES/aes_text_encrypt2.png "Encrypted text using AES") |
| ENCRYPT (FILE) | ![file-input-aes](/sample_runs/AES/aes_file_encrypt1.png "Encrypt file using AES") | ![file-output-aes](/sample_runs/AES/aes_file_encrypt2.png "Encrypted file using AES") |
| DECRYPT (TEXT) | ![text-input-aes](/sample_runs/AES/aes_text_decrypt1.png "Decrypt text using AES") | ![text-output-aes](/sample_runs/AES/aes_text_decrypt2.png "Decrypted text using AES") |
| DECRYPT (FILE) | ![file-input-aes](/sample_runs/AES/aes_file_decrypt1.png "Decrypt file using AES") | ![file-output-aes](/sample_runs/AES/aes_file_decrypt2.png "Decrypted file using AES") |

### Blowfish
| MODE | INPUT | OUTPUT |
| ---- | ------- | -------- |
| ENCRYPT (TEXT) | ![text-input-bf](/sample_runs/Blowfish/bf_text_encrypt1.png "Encrypt text using Blowfish") | ![text-output-bf](/sample_runs/Blowfish/bf_text_encrypt2.png "Encrypted text using Blowfish") |
| ENCRYPT (FILE) | ![file-input-bf](/sample_runs/Blowfish/bf_file_encrypt1.png "Encrypt file using Blowfish") | ![file-output-bf](/sample_runs/Blowfish/bf_file_encrypt2.png "Encrypted file using Blowfish") |
| DECRYPT (TEXT) | ![text-input-bf](/sample_runs/Blowfish/bf_text_decrypt1.png "Decrypt text using Blowfish") | ![text-output-bf](/sample_runs/Blowfish/bf_text_decrypt2.png "Decrypted text using Blowfish") |
| DECRYPT (FILE) | ![file-input-bf](/sample_runs/Blowfish/bf_file_decrypt1.png "Decrypt file using Blowfish") | ![file-output-bf](/sample_runs/Blowfish/bf_file_decrypt2.png "Decrypted file using Blowfish") |

### International Data Encryption Algorithm (IDEA)
| MODE | INPUT | OUTPUT |
| ---- | ------- | -------- |
| ENCRYPT (TEXT) | ![text-input-idea](/sample_runs/IDEA/idea_text_encrypt1.png "Encrypt text using IDEA") | ![text-output-idea](/sample_runs/IDEA/idea_text_encrypt2.png "Encrypted text using IDEA") | 
| ENCRYPT (FILE) | ![file-input-idea](/sample_runs/IDEA/idea_file_encrypt1.png "Encrypt file using IDEA") | ![file-output-idea](/sample_runs/IDEA/idea_file_encrypt2.png "Encrypted file using IDEA") |
| DECRYPT (TEXT) | ![text-input-idea](/sample_runs/IDEA/idea_text_decrypt1.png "Decrypt text using IDEA") | ![text-output-idea](/sample_runs/IDEA/idea_text_decrypt2.png "Decrypted text using IDEA") |
| DECRYPT (FILE) | ![file-input-idea](/sample_runs/IDEA/idea_file_decrypt1.png "Decrypt file using IDEA") | ![file-output-idea](/sample_runs/IDEA/idea_file_decrypt2.png "Decrypted file using IDEA") |

## Asymmetric Algorithms

### Rivest-Shamir-Adleman (RSA)
| MODE | INPUT | OUTPUT |
| ---- | ----- | ------ |
| GENERATE KEYS | ![genkeys-input-rsa](/sample_runs/RSA/rsa_keygen1.png "Generating key pairs for RSA") | ![genkeys-output-rsa](/sample_runs/RSA/rsa_keygen2.png "Generated key pairs for RSA") |
| ENCRYPT (TEXT) | ![text-input-rsa](/sample_runs/RSA/rsa_text_encrypt1.png "Encrypt text using RSA") | ![text-output-rsa](/sample_runs/RSA/rsa_text_encrypt2.png "Encrypted text using RSA") |
| ENCRYPT (FILE) | ![file-input-rsa](/sample_runs/RSA/rsa_file_encrypt1.png "Encrypt file using RSA") | ![file-output-rsa](/sample_runs/RSA/rsa_file_encrypt2.png "Encrypted file using RSA") |
| DECRYPT (TEXT) | ![text-input-rsa](/sample_runs/RSA/rsa_text_decrypt1.png "Decrypt text using RSA") | ![text-output-rsa](/sample_runs/RSA/rsa_text_decrypt2.png "Decrypted text using RSA") |
| DECRYPT (FILE) | ![file-input-rsa](/sample_runs/RSA/rsa_file_decrypt1.png "Decrypt file using RSA") | ![file-output-rsa](/sample_runs/RSA/rsa_file_decrypt2.png "Decrypted file using RSA") |

### Elliptic Curve Cryptography (ECC)
| MODE | INPUT | OUTPUT |
| ---- | ----- | ------ |
| GENERATE KEYS | ![genkeys-input-ecc](/sample_runs/ECC/ecc_keygen1.png "Generating key pairs for ECC") | ![genkeys-output-ecc](/sample_runs/ECC/ecc_keygen2.png "Generated key pairs for ECC") |
| ENCRYPT (TEXT) | ![text-input-ecc](/sample_runs/ECC/ecc_text_encrypt1.png "Encrypt text using ECC") | ![text-output-ecc](/sample_runs/ECC/ecc_text_encrypt2.png "Encrypted text using ECC") |
| ENCRYPT (FILE) | ![file-input-ecc](/sample_runs/ECC/ecc_file_encrypt1.png "Encrypt file using ECC") | ![file-output-ecc](/sample_runs/ECC/ecc_file_encrypt2.png "Encrypted file using ECC") |
| DECRYPT (TEXT) | ![text-input-ecc](/sample_runs/ECC/ecc_text_decrypt1.png "Decrypt text using ECC") | ![text-output-ecc](/sample_runs/ECC/ecc_text_decrypt2.png "Decrypted text using ECC") |
| DECRYPT (FILE) | ![file-input-ecc](/sample_runs/ECC/ecc_file_decrypt1.png "Decrypt file using ECC") | ![file-output-ecc](/sample_runs/ECC/ecc_file_decrypt2.png "Decrypted file using ECC") |

## Hashing Functions

### Secure Hashing Algorithm-1 (SHA-1)
| TYPE | INPUT | OUTPUT |
| ---- | ----- | ------ |
| TEXT | ![text-input-sha1](/sample_runs/Hashing/SHA-1-text1.png "Hashing text using SHA1") | ![text-input-sha1](/sample_runs/Hashing/SHA-1-text2.png "Hashed text using SHA1") |
| FILE | ![file-input-sha1](/sample_runs/Hashing/SHA-1-file1.png "Hashing file using SHA1") | ![file-input-sha1](/sample_runs/Hashing/SHA-1-file2.png "Hashed file using SHA1") |

### Secure Hashing Algorithm-2 (SHA-2)
| TYPE | INPUT | OUTPUT |
| ---- | ----- | ------ |
| TEXT | ![text-input-sha-256](/sample_runs/Hashing/SHA-256-text1.png "Hashing text using SHA-256") | ![text-input-sha-256](/sample_runs/Hashing/SHA-256-text2.png "Hashed text using SHA-256") |
| FILE | ![file-input-sha-256](/sample_runs/Hashing/SHA-256-file1.png "Hashing file using SHA-256") | ![file-input-sha-256](/sample_runs/Hashing/SHA-256-file2.png "Hashed file using SHA-256") |

### Secure Hashing Algorithm-3 (SHA-3)
| TYPE | INPUT | OUTPUT |
| ---- | ----- | ------ |
| TEXT | ![text-input-sha3-256](/sample_runs/Hashing/SHA3-256-text1.png "Hashing text using SHA3-256") | ![text-input-sha3-256](/sample_runs/Hashing/SHA3-256-text2.png "Hashed text using SHA3-256") |
| FILE | ![file-input-sha3-256](/sample_runs/Hashing/SHA3-256-file1.png "Hashing file using SHA3-256") | ![file-input-sha3-256](/sample_runs/Hashing/SHA3-256-file2.png "Hashed file using SHA3-256") |

### Message Digest-5 (MD5)
| TYPE | INPUT | OUTPUT |
| ---- | ----- | ------ |
| TEXT | ![text-input-md5](/sample_runs/Hashing/MD5-text1.png "Hashing text using MD5") | ![text-input-md5](/sample_runs/Hashing/MD5-text2.png "Hashed text using MD5") |
| FILE | ![file-input-md5](/sample_runs/Hashing/MD5-file1.png "Hashing file using MD5") | ![file-input-md5](/sample_runs/Hashing/MD5-file2.png "Hashed file using MD5") |

### BLAKE2
| TYPE | INPUT | OUTPUT |
| ---- | ----- | ------ |
| TEXT | ![text-input-blake2](/sample_runs/Hashing/BLAKE2-text1.png "Hashing text using BLAKE2") | ![text-input-blake2](/sample_runs/Hashing/BLAKE2-text2.png "Hashed text using BLAKE2") |
| FILE | ![file-input-blake2](/sample_runs/Hashing/BLAKE2-file1.png "Hashing file using BLAKE2") | ![file-input-blake2](/sample_runs/Hashing/BLAKE2-file2.png "Hashed file using BLAKE2") |

### GOST R 34.11-2012
| TYPE | INPUT | OUTPUT |
| ---- | ----- | ------ |
| TEXT | ![text-input-gost](/sample_runs/Hashing/GOST-text1.png "Hashing text using GOST") | ![text-input-gost](/sample_runs/Hashing/GOST-text2.png "Hashed text using GOST") |
| FILE | ![file-input-gost](/sample_runs/Hashing/GOST-file1.png "Hashing file using GOST") | ![file-input-gost](/sample_runs/Hashing/GOST-file2.png "Hashed file using GOST") | 