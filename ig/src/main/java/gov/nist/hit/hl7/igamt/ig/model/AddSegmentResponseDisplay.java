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
package gov.nist.hit.hl7.igamt.ig.model;

import java.util.ArrayList;
import java.util.List;

/**
 * @author ena3
 *
 */
public class AddSegmentResponseDisplay {
  List<TreeNode> datatypes = new ArrayList<TreeNode>();
  List<TreeNode> segments = new ArrayList<TreeNode>();

  List<TreeNode> valueSets = new ArrayList<TreeNode>();


  public List<TreeNode> getDatatypes() {
    return datatypes;
  }

  public void setDatatypes(List<TreeNode> datatypes) {
    this.datatypes = datatypes;
  }

  public List<TreeNode> getSegments() {
    return segments;
  }

  public void setSegments(List<TreeNode> segments) {
    this.segments = segments;
  }

  public List<TreeNode> getValueSets() {
    return valueSets;
  }

  public void setValueSets(List<TreeNode> valueSets) {
    this.valueSets = valueSets;
  }
}
