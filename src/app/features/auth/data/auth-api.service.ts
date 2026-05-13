import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginDto } from "../models/dto/login.dto";
import { LoginResponseDto } from "../models/dto/login-response.dto";
import { delay, Observable, of, throwError, timer, concatMap } from "rxjs";
import { v4 as uuidv4 } from "uuid";


const MOCK_USERS = [
    { email: 'maher.samy@mail.com', password: 'Pass@123' },
    { email: 'anas.nour@mail.com', password: 'Pass@123' },
];

@Injectable({ providedIn: 'root' })
export class AuthApi {
    private readonly http = inject(HttpClient);

    login(data: LoginDto): Observable<LoginResponseDto> {
        const user = MOCK_USERS.find(u => u.email === data.email && u.password === data.password);
        if (user) {
            return of({ token: uuidv4() }).pipe(delay(1000));
        } else {
            return timer(1000).pipe(concatMap(() => throwError(() => new Error('Invalid credentials'))));
        }
    }
}