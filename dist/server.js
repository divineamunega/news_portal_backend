"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    var _a;
    console.log(`Server running on port ${PORT} in ${(_a = process.env.ENVIROMENT) === null || _a === void 0 ? void 0 : _a.toLowerCase()}.`);
});
