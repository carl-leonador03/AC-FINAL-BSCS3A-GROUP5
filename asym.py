import sslcrypto
import io

from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes

curve = sslcrypto.ecc.get_curve("secp521r1")

def generate_keys(algo: str) -> tuple[bytes, bytes]:
    if algo == "ecc":  
        private_key = curve.new_private_key()
        public_key = curve.private_to_public(private_key)
        return (private_key, public_key)
    
    elif algo == 'rsa':
        key = RSA.generate(2048)
        private_key = key.exportKey()
        public_key = key.publickey().exportKey()
        return (private_key, public_key)
    
    else:
        raise ValueError("Unsupported algorithm: " + algo)

def ecc(key: bytes, data: bytes, mode: int = 0) -> bytes:
    """
    A convenience function to encrypt and decrypt data using
    Elliptic Curve Cryptography (ECC). Uses AES-256 CBC.
    """
    if mode == 0:
        return curve.encrypt(data, key)
    elif mode == 1:
        return curve.decrypt(data, key)
    else:
        return b''

def rsa(key: bytes, data: bytes, mode: int = 0) -> bytes:
    """
    A convenience function to encrypt and decrypt data using
    Rivest-Shamir-Adleman (RSA). Uses a hybrid implementation of RSA and AES encryption.
    """
    if mode == 0: # ENCRYPTION
        pbkey = RSA.import_key(key)
        session_key = get_random_bytes(16)

        cipher_rsa = PKCS1_OAEP.new(pbkey)
        enc_session_key = cipher_rsa.encrypt(session_key)

        cipher_aes = AES.new(session_key, AES.MODE_EAX)
        enc_data, tag = cipher_aes.encrypt_and_digest(data)

        enc_payload = io.BytesIO()
        enc_payload.write(enc_session_key)
        enc_payload.write(cipher_aes.nonce)
        enc_payload.write(tag)
        enc_payload.write(enc_data)
        _ = enc_payload.seek(0)

        enc_payload_data = enc_payload.read()
        enc_payload.close()
        del enc_payload

        return enc_payload_data
    
    elif mode == 1: # DECRYPTION
        pvkey = RSA.import_key(key)

        enc_payload = io.BytesIO(data)

        enc_session_key = enc_payload.read(pvkey.size_in_bytes())
        nonce = enc_payload.read(16)
        tag = enc_payload.read(16)
        enc_data = enc_payload.read(-1)

        enc_payload.close()
        del enc_payload

        cipher_rsa = PKCS1_OAEP.new(pvkey)
        session_key = cipher_rsa.decrypt(enc_session_key)

        cipher_aes = AES.new(session_key, AES.MODE_EAX, nonce)
        decrypted = cipher_aes.decrypt_and_verify(enc_data, tag)

        return decrypted
    
    else:
        return b''

