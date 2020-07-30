package pages;
import base.TestBase;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import util.TestUtil;

public class SignUpPage extends TestBase {
        @FindBy(xpath = "//h1[text()='Registration']")
        WebElement regPopUp;
        @FindBy(name = "firstName")
        WebElement enterFirstName;
        @FindBy(id = "lastName")
        WebElement enterLastName;
        @FindBy(id = "mail")
        WebElement enterEmail;
        @FindBy(id = "newPasswordInput")
        WebElement enterPassword;
        @FindBy(id = "retypeNewPasswordInput")
        WebElement re_EnterPassword;
        @FindBy(id = "pdAccept")
        WebElement privacyStmt;
        @FindBy(id = "touAccept")
        WebElement termsCondition;
        @FindBy(id = "sapStoreRegisterFormSubmit")
        WebElement submitBtn;
        @FindBy(xpath = "//h1[text()='Thank you for registering with SAP Conversational AI']")
        WebElement successMsg;
        @FindBy(xpath = "//a[@title='Close']")
        WebElement popUpclose;

        public SignUpPage() {
            PageFactory.initElements(TestBase.driver, this);
        }


        public void fillDetails(String firstName, String LastName, String Email, String password, String reEnterPasswprd) throws InterruptedException {
            enterFirstName.sendKeys(firstName);
            enterLastName.sendKeys(LastName);
            enterEmail.sendKeys(Email);
            enterPassword.sendKeys(password);
            re_EnterPassword.sendKeys(reEnterPasswprd);
            privacyStmt.click();
            termsCondition.click();
        }
        public void submit() {
            submitBtn.click();
        }

        public String getSucessMsg() throws InterruptedException {
            return successMsg.getText();
        }
        public void closePopUp() {
            popUpclose.click();
        }

        public String verifyRegisterPopUp() throws InterruptedException {
            TestUtil.waitForElementVisible(driver, regPopUp, 3);
            return regPopUp.getText();
        }
    }

