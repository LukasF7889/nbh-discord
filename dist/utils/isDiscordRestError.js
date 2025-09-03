function isDiscordRestError(error) {
    return typeof error === "object" && error !== null && "code" in error;
}
export default isDiscordRestError;
//# sourceMappingURL=isDiscordRestError.js.map