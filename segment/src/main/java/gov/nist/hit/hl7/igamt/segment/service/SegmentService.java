/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.segment.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;

import gov.nist.hit.hl7.igamt.common.base.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.service.ResourceService;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeItemDomain;
import gov.nist.hit.hl7.igamt.datatype.domain.display.DisplayMetadata;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PostDef;
import gov.nist.hit.hl7.igamt.datatype.domain.display.PreDef;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentConformanceStatement;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentDynamicMapping;
import gov.nist.hit.hl7.igamt.segment.domain.display.SegmentStructureDisplay;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentNotFoundException;
import gov.nist.hit.hl7.igamt.segment.exception.SegmentValidationException;
import gov.nist.hit.hl7.igamt.segment.serialization.exception.CoConstraintSaveException;

/**
 *
 * @author Jungyub Woo on Mar 15, 2018 .
 */
public interface SegmentService extends ResourceService {

  public Segment findByKey(CompositeKey key);

  public Segment findLatestById(String id);

  public Segment create(Segment segment);

  public Segment save(Segment segment) throws ValidationException;

  public List<Segment> findAll();

  public void delete(Segment segment);

  public void removeCollection();

  public List<Segment> findByDomainInfoVersion(String version);

  public List<Segment> findByDomainInfoScope(String scope);

  public List<Segment> findByDomainInfoScopeAndDomainInfoVersion(String scope, String verion);

  public List<Segment> findByName(String name);

  public List<Segment> findByDomainInfoScopeAndDomainInfoVersionAndName(String scope,
      String version, String name);

  public List<Segment> findByDomainInfoVersionAndName(String version, String name);

  public List<Segment> findByDomainInfoScopeAndName(String scope, String name);

  public Segment getLatestById(String id);

  public DisplayMetadata convertDomainToMetadata(Segment segment);

  public PreDef convertDomainToPredef(Segment segment);

  public PostDef convertDomainToPostdef(Segment segment);

  public List<Segment> findDisplayFormatByScopeAndVersion(String scope, String version);

  public SegmentConformanceStatement convertDomainToConformanceStatement(Segment segment);

  public SegmentDynamicMapping convertDomainToSegmentDynamicMapping(Segment segment);



  /**
   * Validate the metadata information of the segment
   * 
   * @param metadata
   * @throws SegmentValidationException
   */
  public void validate(DisplayMetadata metadata) throws SegmentValidationException;


  /**
   * 
   * @param predef
   * @return
   * @throws SegmentNotFoundException
   */
  public Segment savePredef(PreDef predef) throws SegmentNotFoundException;

  /**
   * 
   * @param postdef
   * @return
   * @throws SegmentNotFoundException
   */
  public Segment savePostdef(PostDef postdef) throws SegmentNotFoundException;

  /**
   * 
   * @param metadata
   * @return
   * @throws SegmentNotFoundException
   * @throws SegmentValidationException
   */
  public Segment saveMetadata(DisplayMetadata metadata)
      throws SegmentNotFoundException, SegmentValidationException;

  /**
   * Validate conformance statements of the segment
   * 
   * @param conformanceStatement
   * @throws SegmentValidationException
   */
  public void validate(SegmentConformanceStatement conformanceStatement)
      throws SegmentValidationException;


  /**
   * Save the conformance statements of the segment
   * 
   * @param conformanceStatement
   * @return
   * @throws SegmentNotFoundException
   * @throws SegmentValidationException
   */
  public Segment saveConformanceStatement(SegmentConformanceStatement conformanceStatement)
      throws SegmentNotFoundException, SegmentValidationException;


  public Link cloneSegment(CompositeKey compositeKey, HashMap<String, CompositeKey> datatypesMap,
      HashMap<String, CompositeKey> valuesetsMap, Link l, String username)
      throws CoConstraintSaveException;

  public Segment saveDynamicMapping(SegmentDynamicMapping dynamicMapping)
      throws SegmentNotFoundException, SegmentValidationException;

  /**
   * @param dynamicMapping
   * @throws SegmentValidationException
   */
  void validate(SegmentDynamicMapping dynamicMapping) throws SegmentValidationException;

  /**
   * @param segment
   * @return
   */
  public SegmentStructureDisplay convertDomainToDisplayStructure(Segment segment);

  /**
   * @param s
   * @param cItems
   * @return
   * @throws JsonProcessingException
   * @throws IOException
   */
  public List<ChangeItemDomain> updateSegmentByChangeItems(Segment s, List<ChangeItemDomain> cItems)
      throws JsonProcessingException, IOException;

}
