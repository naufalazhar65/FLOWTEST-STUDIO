import { Panel } from "../ui/Panel";

export function CodePanel() {
    return (
        <Panel title="Python Preview">
            <pre
                style={{
                    color: "#3FB950",
                    lineHeight: 1.8,
                }}
            >
                {`def test_login(driver):

    pass`}
            </pre>
        </Panel>
    );
}