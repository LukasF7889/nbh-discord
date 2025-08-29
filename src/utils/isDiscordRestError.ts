function isDiscordRestError(error: unknown): error is DiscordRestError {
  return typeof error === "object" && error !== null && "code" in error;
}

export default isDiscordRestError;
