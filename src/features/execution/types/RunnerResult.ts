export interface RunnerResult {
  /**
   * Output handle yang dipilih oleh runner.
   */
  outputs: string[];

  /**
   * Screenshot hasil execution dalam bentuk
   * base64 yang dikembalikan oleh Appium.
   */
  screenshot?: string;

  /**
   * Nama file screenshot dari Screenshot node.
   */
  screenshotFileName?: string;
}