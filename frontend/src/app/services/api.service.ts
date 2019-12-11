import { Injectable } from "@angular/core";
import { AppConstants } from "../app.constants";
import { HttpClient } from "@angular/common/http";
import { throwError, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import * as cryptojs from "crypto-js";
import * as forge from "node-forge";
import * as bcrypt from "bcryptjs";
import { EncryptionService } from "./encryption.service";
var primes = require("primes");

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private encryptionService: EncryptionService
  ) {}

  login(username: String, password: String) {
    let url = AppConstants.apiURL + "/authenticate/" + username;
    return this.httpClient.get(url).pipe(
      map(resp => {
        if (
          resp["status"] == 200 &&
          bcrypt.compareSync(password, resp["password"])
        ) {
          //successful login
          return resp;
        }
        return this.error(resp["message"]);
      })
    );
  }

  createUser(username: String, password: String) {
    let url = AppConstants.apiURL + "/user";
    let payload = {
      user_name: username,
      password: this.hash(password, username)
    };
    return this.httpClient.post(url, payload).pipe(
      map(resp => {
        if (resp["status"] == 201) {
          //successful signup
          return resp;
        }
        return this.error(resp["message"]);
      })
    );
  }

  async sendMessage(
    sender: string,
    receiver: string,
    message: string,
    algorithm: string,
    sharedKey: string
  ) {
    let dh = await this.dhKeyExchangeSend(sender);
    let encryptedMessage = await this.encryptMessage(
      message,
      algorithm,
      dh["shared secret"]
    );
    let url = AppConstants.apiURL + "/send";
    let payload = {
      sender: sender,
      receiver: receiver,
      message: encryptedMessage,
      encryption: algorithm,
      ID: dh["ID"]
    };
    return this.httpClient.post(url, payload).toPromise();
  }
  getUsers() {
    let url = AppConstants.apiURL + "/users";
    return this.httpClient.get(url);
  }
  async getMessages(receiver: string) {
    let dh = await this.dhKeyExchangeReceive(receiver);
    let url = AppConstants.apiURL + "/user/" + receiver + "/messages";
    let resp = await this.httpClient.get(url).toPromise();
    for (let message of resp["messages"]) {
      // Decrypt encrypted key that message was originally sent with
      let decryptedKey = this.decryptMessage(
        message["key"],
        "AES",
        dh["shared secret"]
      );
      message["key"] = decryptedKey;
    }
    return new Promise(resolve => {
      resolve(resp);
    });
  }

  dhKeyExchangeSend(username: String) {
    return this.dhKeyExchange(username, "send");
  }

  dhKeyExchangeReceive(username: String) {
    return this.dhKeyExchange(username, "receive");
  }

  async dhKeyExchange(username: String, urlExtension: string) {
    let secretKey = Math.floor(Math.random() * 10);
    let primeNums = primes(100);
    let g = primeNums[Math.floor(Math.random() * primeNums.length)];
    let n = primeNums[Math.floor(Math.random() * primeNums.length)];

    // A = our public key
    let A = Math.pow(g, secretKey) % n;
    let url = AppConstants.apiURL + "/dhExchange/" + urlExtension;
    let payload = {
      g: g,
      n: n,
      client_public_key: A,
      username: username
    };

    let dh = await this.httpClient.post(url, payload).toPromise();
    let sharedSecret = dh["public_key"] ** secretKey % n;
    dh["shared secret"] = sharedSecret;
    return new Promise(resolve => {
      resolve(dh);
    });
  }

  rsaKeyExchange(publicKey, username: String) {
    console.log("Key: " + publicKey);

    let url = AppConstants.apiURL + "/rsa";
    let payload = {
      client_public_key: publicKey,
      username: username
    };

    return this.httpClient.post(url, payload);
  }

  error(message) {
    return throwError(message);
  }

  hash(plaintext: any, salt: any) {
    let saltValue = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintext, saltValue);

    //return cryptojs.PBKDF2(plaintext + salt).toString();
  }

  encryptMessage(plaintext: any, algorithm: string, sharedKey: any) {
    sharedKey = sharedKey.toString();
    switch (algorithm) {
      case "RSA": {
        //TODO: Implement RSA Encryption
        return plaintext;
      }
      case "AES": {
        return cryptojs.AES.encrypt(plaintext, sharedKey).toString();
      }
      case "DES": {
        return cryptojs.DES.encrypt(plaintext, sharedKey).toString();
      }
      case "3DES": {
        return cryptojs.TripleDES.encrypt(plaintext, sharedKey).toString();
      }
      default: {
        //TODO: Return error
        console.log("ERROR default in encrypt message api service");
        break;
      }
    }
  }

  decryptMessage(cipherText: any, algorithm: string, sharedKey: any) {
    sharedKey = sharedKey.toString();
    switch (algorithm) {
      case "RSA": {
        //TODO: Implement RSA Decryption
        return cipherText;
      }
      case "AES": {
        return cryptojs.AES.decrypt(cipherText, sharedKey).toString(
          cryptojs.enc.Utf8
        );
      }
      case "DES": {
        return cryptojs.DES.decrypt(cipherText, sharedKey).toString(
          cryptojs.enc.Utf8
        );
      }
      case "3DES": {
        return cryptojs.TripleDES.decrypt(cipherText, sharedKey).toString(
          cryptojs.enc.Utf8
        );
      }
      default: {
        //TODO: Return error
        break;
      }
    }
  }
}
