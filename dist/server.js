"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = process.env.PORT || 3000;
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
server.listen(PORT, () => {
    var _a;
    console.log(`Server running on port ${PORT} in ${(_a = process.env.ENVIROMENT) === null || _a === void 0 ? void 0 : _a.toLowerCase()}.`);
});
