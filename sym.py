from Crypto.Cipher import DES
from Crypto.Cipher import AES
from Crypto.Cipher import Blowfish

from cryptography.hazmat.decrepit.ciphers.algorithms import IDEA
from cryptography.hazmat.primitives.ciphers import Cipher, modes
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

aes_iv = get_random_bytes(16)
blowfish_iv = get_random_bytes(8)
idea_iv = get_random_bytes(8)

def des(key: bytes, data: bytes, mode: int = 0) -> bytes:
    """
    Encrypts or decrypts data with Data Encryption Standard (DES) algorithm.

    Default mode: 0 (encrypt). 1 is decrypt.
    """
    if len(key) == 8:
        cipher = DES.new(key, DES.MODE_ECB)
        if mode == 0:
            return cipher.encrypt(pad(data, cipher.block_size))
    
        elif mode == 1:
            return unpad(cipher.decrypt(data), cipher.block_size)
        
        else:
            return b''
    else:
        return b''

def aes(key: bytes, data: bytes, mode: int = 0) -> bytes:
    """
    Encrypts or decrypts data with Advanced Encryption Standard (AES) algorithm.

    Default mode: 0 (encrypt). 1 is decrypt.
    """

    if len(key) <= 32:
        key = pad(key, 32)
        cipher = AES.new(key, AES.MODE_CBC, aes_iv)
        if mode == 0:
            return cipher.encrypt(pad(data, 16))

        elif mode == 1:
            return unpad(cipher.decrypt(data), 16)
        
        else:
            return b''
    
    else:
        return b''

def blowfish(key: bytes, data: bytes, mode: int = 0) -> bytes:
    """
    Encrypts or decrypts data with Blowfish algorithm.

    Default mode: 0 (encrypt). 1 is decrypt.
    """

    if len(key) <= 56:
        key = pad(key, 56)
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, blowfish_iv)
        if mode == 0:
            return cipher.encrypt(pad(data, cipher.block_size))
        elif mode == 1:
            return unpad(cipher.decrypt(data), cipher.block_size)
        else:
            return b''
    else:
        return b''

def idea(key: bytes, data: bytes, mode: int = 0) -> bytes:
    """
    Encrypts or decrypts data with International Data Encryption Algorithm (IDEA).

    Default mode: 0 (encrypt). 1 is decrypt.
    """
    cipher = Cipher(IDEA(key), mode=modes.CBC(idea_iv))

    if len(key) == 16:
        if mode == 0:
            return cipher.encryptor().update(pad(data, IDEA.block_size))

        elif mode == 1:
            if len(key) == 16:
                return unpad(cipher.decryptor().update(data), IDEA.block_size)

        else:
            return b''
    
    else:
        return b''