package com.swipes;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.horcrux.svg.SvgPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.BV.LinearGradient.LinearGradientPackage;
import com.robinpowered.react.Intercom.IntercomPackage;
import io.intercom.android.sdk.Intercom;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.microsoft.codepush.react.CodePush;
import com.reactlibrary.RNReactNativeDocViewerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new SvgPackage(),
            new ReactNativeOneSignalPackage(),
            new RNMixpanel(),
            new LinearGradientPackage(),
            new IntercomPackage(),
            new ImagePickerPackage(),
            new RNDeviceInfo(),
            new AutoGrowTextInputPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new RNReactNativeDocViewerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Intercom.initialize(this, "android_sdk-a53db85501edc71346df31810c45626fd00506a2", "q8xibmac");
    SoLoader.init(this, /* native exopackage */ false);
  }
}
