from hashlib import sha1 as SHA1, sha256 as SHA256, md5 as MD5, blake2b

import hashlib      # for FSB
import gostcrypto

from io import BytesIO

def sha1(data: str | bytes) -> str:
    """Convenience function for hashing with SHA-1 hashing.
    Returns a hex digested string."""
    sha1_hash = SHA1()
    sha1_hash.update(data.encode() if isinstance(data, str) else data)
    
    return sha1_hash.hexdigest()

def sha256(data: str | bytes) -> str:
    """Convenience function for hashing with SHA-256 hashing.
    Returns a hex digested string."""
    sha256_hash = SHA256()
    sha256_hash.update(data.encode() if isinstance(data, str) else data)
    
    return sha256_hash.hexdigest()

def md5(data: str | bytes) -> str:
    """Convenience function for hashing with MD5 hashing.
    Returns a hex digested string."""
    md5_hash = MD5()
    md5_hash.update(data.encode() if isinstance(data, str) else data)
    
    return md5_hash.hexdigest()

def blake2(data: str | bytes) -> str:
    """Convenience function for hashing with BLAKE2 hashing.
    Returns a hex digested string."""
    blake2_hash = blake2b()
    blake2_hash.update(data.encode() if isinstance(data, str) else data)
    
    return blake2_hash.hexdigest()

def fsb(data: str | bytes) -> str:
    """Convenience function for hashing with FSB hashing.
    Returns a hex digested string."""
    fsb_hash = hashlib.new('fsb')
    fsb_hash.update(data.encode() if isinstance(data, str) else data)
    
    return fsb_hash.hexdigest()

def gost(data: str | bytes) -> str:
    """Convenience function for hashing with GOST hashing.
    Returns a hex digested string."""

    if isinstance(data, str):
        hash_obj = gostcrypto.gosthash.new('streebog256', data=data.encode())
        return hash_obj.hexdigest()
    
    elif isinstance(data, bytes):
        buffer_size = 128
        hash_obj = gostcrypto.gosthash.new('streebog512')

        with BytesIO(data) as data_:
            buffer = data_.read(buffer_size)

            while len(buffer) > 0:
                hash_obj.update(buffer)
                buffer = data_.read(buffer_size)
        
        return hash_obj.hexdigest()

