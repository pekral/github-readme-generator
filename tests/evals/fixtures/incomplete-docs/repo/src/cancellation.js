export class CancellationToken {
  #cancelled = false;

  cancel() {
    this.#cancelled = true;
  }

  throwIfCancelled() {
    if (this.#cancelled) throw new Error('Operation cancelled.');
  }
}
