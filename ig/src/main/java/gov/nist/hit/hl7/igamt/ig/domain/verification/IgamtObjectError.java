/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.ig.domain.verification;

import gov.nist.hit.hl7.igamt.common.base.domain.Type;

/**
 * @author jungyubw
 *
 */
public class IgamtObjectError {  
  private String code;
  private String target;
  private Type targetType;
  private String description;
  private String location;
  
  private String severity;
  
  public IgamtObjectError(){
    super();
  }
  
  public IgamtObjectError(String code, String target, Type targetType, String description,
      String location, String severity) {
    super();
    this.code = code;
    this.target = target;
    this.targetType = targetType;
    this.description = description;
    this.location = location;
    this.severity = severity;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getTarget() {
    return target;
  }

  public void setTarget(String target) {
    this.target = target;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getSeverity() {
    return severity;
  }

  public void setSeverity(String severity) {
    this.severity = severity;
  }

  public Type getTargetType() {
    return targetType;
  }

  public void setTargetType(Type targetType) {
    this.targetType = targetType;
  }
  
  
  

}
