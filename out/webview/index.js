"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const Dendrogram_1 = __importDefault(require("./Dendrogram"));
const App = () => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "React Component Tree"),
        react_1.default.createElement("div", null,
            react_1.default.createElement(Dendrogram_1.default, null))));
};
const root = (0, client_1.createRoot)(document.getElementById('root'));
root.render(react_1.default.createElement(App, null));
//# sourceMappingURL=index.js.map