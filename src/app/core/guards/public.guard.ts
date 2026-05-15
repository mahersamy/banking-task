import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { Router } from "@angular/router";
import { StorageService } from "../services/storage.service";
import { LOCALSTORAGE_KEY } from "../constants/localstorage-key.const";

export const publicGuard: CanActivateFn = () => {
    const router = inject(Router);
    const storage = inject(StorageService);
    const token = storage.get<string>(LOCALSTORAGE_KEY.AUTH_TOKEN);

    if (!token) return true;

    return router.createUrlTree(["/dashboard"]);
};