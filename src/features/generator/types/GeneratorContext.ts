export interface GeneratorContext {
    framework:
        "selenium-python-mobile";

    indent: string;

    newline: string;

    capabilities?:
        Record<string, unknown>;

    serverUrl?: string;
}