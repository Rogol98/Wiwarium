Kiedy zepsuje się karta SD:
1. Kup nową, na 32GB, jakąś, która długo wytrzyma, musi mieć przejściówkę z mircoSD na SD, żebyś mógł wgrać na laptopie na nią OS
2. Zainstaluj na niej OS używając Raspberry Pi Imager
3. Wyłącz RPi, wyciągnij stare SD, włóż nowe SD, podepnij mysz, klawiaturę, monitor, włącz zasilanie
4. Komendy do odpalenia
sudo apt install git
git clone https://github.com/Rogol98/Wiwarium.git
sudo apt update
sudo apt install build-essential python3-dev python3-pip -y
git clone https://github.com/adafruit/Adafruit_Python_DHT.git
cd Adafruit_Python_DHT
sudo python3 setup.py install --force-pi
sudo pip3 install adafruit-blinka --break-system-packages

sudo raspi-config     -> potem wejść w Interface Options i zrobić I2C enabled, zrobić SPI enabled        -> potem sudo reboot

curl -s https://install.zerotier.com | sudo bash
sudo zerotier-cli status
wbić na zerotier i zrobić   ->  zerotier-cli join <network_id>

Do poprawy jeszcze wtedy baza danych i Adafruit
