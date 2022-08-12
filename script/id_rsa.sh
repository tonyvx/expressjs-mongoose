
# private key
openssl genrsa > id_rsa

# public key
openssl rsa -in id_rsa -pubout -out id_rsa.pub

# private key and cert
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365