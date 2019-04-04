package gov.nist.diff.annotation;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface DeltaField {
    public String identifier() default "DEFAULT";
    public String matcher() default ".*";
}
