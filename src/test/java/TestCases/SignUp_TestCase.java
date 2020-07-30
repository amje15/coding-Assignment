package TestCases;

import base.TestBase;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.*;
import pages.HomePage;
import pages.SignUpPage;
import util.TestUtil;
import util.constants;

import java.io.IOException;

public class SignUp_TestCase extends TestBase {

    HomePage homepage;
    SignUpPage signUpPage;

    SignUp_TestCase(){
        super();
    }

    @BeforeTest
    public void Setup(){
        initialization();
        homepage=new HomePage();
    }

    @Test(priority = 1)
    public void ValidateHomePageTitle() {
        Assert.assertTrue(driver.getTitle().equalsIgnoreCase(constants.HomePageTitle));
    }

    @Test(priority = 2)
    public void ValidateSignUpButton() throws InterruptedException {
        homepage.AcceptCookie();
        homepage.ClickOnSignUpButton();
        TestUtil.switchToFrame(constants.frame_name);
        signUpPage=new SignUpPage();
        Assert.assertTrue(signUpPage.verifyRegisterPopUp().contains("Registration"));
    }

    @DataProvider
    public Object[][] retriveData() throws IOException, InvalidFormatException {
        Object data[][] =TestUtil.GetValueFromExcel(constants.sheetname);
        return data;
    }

    @Test(priority = 3, dataProvider = "retriveData")
    public void EnterUserDetails(String firstName, String LastName, String Email, String password,
                                 String reEnterPasswprd) throws InterruptedException {
        signUpPage=new SignUpPage();
        signUpPage.fillDetails(firstName, LastName, Email, password, reEnterPasswprd);
        signUpPage.submit();
    }

    @Test(priority=4)
    public void Validate_Success_Message() throws InterruptedException {
        Assert.assertEquals(signUpPage.getSucessMsg(),constants.successMsg);
        signUpPage.closePopUp();

    }

    @AfterTest
    public void TearDown(){
        driver.quit();
    }
}