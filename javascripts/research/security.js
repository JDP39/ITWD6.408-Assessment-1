export const securityCard = {
    title: "Website Security",

    content: `
        <p>
            5 of the most common security threats to websites include:
        </p>
        <table>
            <tr>
                <th style="text-align: center;">Security Threat</th>
                <th style="text-align: center;">Description</th>
                <th style="text-align: center;">Defense</th>
            </tr>
            <tr>
                <td>Cross-Site Scripting (XSS)</td>
                <td>Attackers inject malicious scripts into trusted websites.</td>
                <td>Sanitize user inputs and enforce a strict Content Security Policy (CSP).</td>
            </tr>
            <tr>
                <td>SQL Injection</td>
                <td>Malicious database queries injected via untrusted input fields.</td>
                <td>Use parameterized queries, prepared statements, or ORM abstraction layers.</td>
            </tr>
            <tr>
                <td>Cross-Site Request Forgery (CSRF)</td>
                <td>Unauthorized commands transmitted from a user trusted by the application.</td>
                <td>Implement anti-CSRF state tokens and configure SameSite cookie attributes.</td>
            </tr>
            <tr>
                <td>Ransomware</td>
                <td>Malicious software that encrypts a user's data and demands a ransom for the decryption key.</td>
                <td>Implement robust backup strategies and keep security software up to date.</td>
            </tr>
            <tr>
                <td>Brute Force Attacks</td>
                <td>Attempts to gain unauthorized access by systematically trying different password combinations.</td>
                <td>Implement account lockout mechanisms and rate-limiting for login attempts.</td>
            </tr>
        </table>
        <p>
            For This assessment, the primary potential security threats involve XSS attacks and client-side data injection, particularly when dynamic input parameters (such as search queries or interactive filter inputs) are rendered into the DOM without sanitization. Because client-side interfaces render dynamic content dynamically, unescaped user inputs could execute malicious JavaScript within the user's browser context. To address this risk, all user inputs must be processed through explicit string escaping functions (or DOM manipulation methods like .textContent rather than .innerHTML), and strict Content Security Policies must be enforced at the server header level to restrict script execution sources.
        </p>
        <a href="https://www.fortinet.com/resources/cyberglossary/types-of-cyber-attacks" target="_blank">https://www.fortinet.com/resources/cyberglossary/types-of-cyber-attacks</a>
    `
};