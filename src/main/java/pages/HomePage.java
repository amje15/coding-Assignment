package pages;

import base.TestBase;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class HomePage extends TestBase {

    @FindBy(xpath = "//div[@class='btn--content'][contains(text(),'Sign up')]")
    WebElement SignUpButton;

    @FindBy(xpath = "//div[text()='OK']")
    WebElement cookies;

    public HomePage(){
        PageFactory.initElements(driver,this);
    }

    public void ClickOnSignUpButton(){
        SignUpButton.click();
    }

    public Boolean AcceptCookie(){
        Boolean cookiesStatus=cookies.isDisplayed();
        cookies.click();
        return cookiesStatus;
    }
}