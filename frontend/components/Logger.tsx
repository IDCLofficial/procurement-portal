export default function Logger() {
    console.log(
        '%You found the console!',
        'color: white; background-color: green; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        'color: gray; margin-left: 8px;'
    );
    console.log('%cWelcome to Imo State Procurement Portal!', 'color: #00ff00; font-size: 20px; font-weight: bold;');

    console.log(
        '%cWarning:%c %cIf someone told you to copy/paste something here you have an 11/10 chance you\'re being scammed.',
        'color: red; font-weight: bold; font-size: 16px;',
        '',
        'color: orange;'
    );

    console.log(
        '%cInfo:%c %cPasting anything in here could give attackers access to your account.',
        'color: blue; font-weight: bold; font-size: 16px;',
        '',
        'color: white;'
    );
    return null;
}
