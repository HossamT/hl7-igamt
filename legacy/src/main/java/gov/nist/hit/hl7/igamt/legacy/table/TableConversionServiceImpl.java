package gov.nist.hit.hl7.igamt.legacy.table;

import java.util.Date;
import java.util.HashSet;
import java.util.List;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant.SCOPE;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Table;
import gov.nist.hit.hl7.igamt.legacy.repository.TableRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeRef;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSystem;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.InternalCode;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ManagedBy;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import gov.nist.hit.hl7.igamt.valueset.service.CodeSystemService;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

public class TableConversionServiceImpl implements ConversionService {
  
  private static TableRepository legacyTableRepository = (TableRepository) legacyContext.getBean("tableRepository");
  private static ValuesetService valuesetService = (ValuesetService) context.getBean("valuesetService");
  private static CodeSystemService codeSystemService = (CodeSystemService) context.getBean("codeSystemService");

  @Override
  public void convert() {
    init();
    List<Table> allTables = legacyTableRepository.findAll();
    for (Table t : allTables) {
      this.convertTable(t);      
    }
  }

  private void convertTable(Table table) {
    Valueset v = new Valueset();

    v.setBindingIdentifier(table.getBindingIdentifier());
    v.setCreatedFrom(table.getCreatedFrom());
    v.setDescription(table.getDescription());
    v.setComment(table.getComment());
    v.setName(table.getName());
    v.setPostDef(table.getDefPostText());
    v.setPreDef(table.getDefPreText());
    v.setOid(table.getOid());
    v.setUsername(null);
    v.setIntensionalComment(table.getIntensionalComment());

    if (table.getContentDefinition().equals(
        gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ContentDefinition.Extensional)) {
      v.setContentDefinition(ContentDefinition.Extensional);
    } else if (table.getContentDefinition().equals(
        gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ContentDefinition.Intensional)) {
      v.setContentDefinition(ContentDefinition.Intensional);
    } else {
      v.setContentDefinition(ContentDefinition.Undefined);
    }

    if (table.getExtensibility()
        .equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Extensibility.Closed)) {
      v.setExtensibility(Extensibility.Closed);
    } else if (table.getExtensibility()
        .equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Extensibility.Open)) {
      v.setExtensibility(Extensibility.Open);
    } else {
      v.setExtensibility(Extensibility.Undefined);
    }

    if (table.getStability()
        .equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Stability.Dynamic)) {
      v.setStability(Stability.Dynamic);
    } else if (table.getStability()
        .equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Stability.Static)) {
      v.setStability(Stability.Static);
    } else {
      v.setStability(Stability.Undefined);
    }

    if (table.getManagedBy() != null
        && table.getManagedBy().equals("External-Exteranlly Managed")) {
      v.setManagedBy(ManagedBy.External);
    } else {
      v.setManagedBy(ManagedBy.Internal);
    }
    // TODO need check
    v.setUrl(null);

    PublicationInfo publicationInfo = new PublicationInfo();
    publicationInfo.setPublicationDate(new Date());
    publicationInfo.setPublicationVersion("" + table.getPublicationVersion());
    v.setPublicationInfo(publicationInfo);
    if (table.getScope().equals(SCOPE.HL7STANDARD)) {
      DomainInfo domainInfo = new DomainInfo();
      domainInfo.setVersion(table.getVersion());
      // TODO need check
      domainInfo.setCompatibilityVersion(new HashSet<String>());
      domainInfo.setScope(Scope.HL7STANDARD);
      v.setDomainInfo(domainInfo);

      CodeSystem codeSystem = new CodeSystem();
      codeSystem.setId(new CompositeKey());
      codeSystem.setIdentifier("HL7" + table.getBindingIdentifier());
      codeSystem.setDomainInfo(domainInfo);

      if (table.getCodes() != null) {
        for (gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Code c : table.getCodes()) {
          Code code = new Code();
          code.setCodeSystemId(codeSystem.getId().getId());
          code.setDescription(c.getLabel());
          code.setValue(c.getValue());
          codeSystem.addCode(code);

          CodeRef codeRef = new CodeRef();
          codeRef.setCodeId(code.getId());
          codeRef.setCodeSystemId(codeSystem.getId().getId());
          if (c.getCodeUsage().equals("R")) {
            codeRef.setUsage(CodeUsage.R);
          } else if (c.getCodeUsage().equals("E")) {
            codeRef.setUsage(CodeUsage.E);
          } else {
            codeRef.setUsage(CodeUsage.P);
          }
          v.addCodeRef(codeRef);
        }
        v.setNumberOfCodes(table.getCodes().size());
      }
      codeSystem = codeSystemService.save(codeSystem);
      v.addCodeSystemId(codeSystem.getId().getId());
    } else if (table.getScope().equals(SCOPE.PHINVADS)) {
      DomainInfo domainInfo = new DomainInfo();
      domainInfo.setVersion(table.getVersion());
      // TODO need check
      domainInfo.setCompatibilityVersion(new HashSet<String>());
      domainInfo.setScope(Scope.PHINVADS);
      v.setDomainInfo(domainInfo);

      CodeSystem codeSystem = new CodeSystem();
      codeSystem.setId(new CompositeKey());
      codeSystem.setIdentifier(table.getBindingIdentifier());
      codeSystem.setDomainInfo(domainInfo);

      if (table.getCodes() != null) {
        for (gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Code c : table.getCodes()) {
          Code code = new Code();
          code.setCodeSystemId(codeSystem.getId().getId());
          code.setDescription(c.getLabel());
          code.setValue(c.getValue());
          codeSystem.addCode(code);

          CodeRef codeRef = new CodeRef();
          codeRef.setCodeId(code.getId());
          codeRef.setCodeSystemId(codeSystem.getId().getId());
          if (c.getCodeUsage().equals("R")) {
            codeRef.setUsage(CodeUsage.R);
          } else if (c.getCodeUsage().equals("E")) {
            codeRef.setUsage(CodeUsage.E);
          } else {
            codeRef.setUsage(CodeUsage.P);
          }
          v.addCodeRef(codeRef);
        }
        v.setNumberOfCodes(table.getCodes().size());
      }
      codeSystem = codeSystemService.save(codeSystem);
      v.addCodeSystemId(codeSystem.getId().getId());
      
    } else if (table.getScope().equals(SCOPE.USER)) {
      DomainInfo domainInfo = new DomainInfo();
      domainInfo.setVersion(table.getVersion());
      // TODO need check
      domainInfo.setCompatibilityVersion(new HashSet<String>());
      domainInfo.setScope(Scope.USER);
      v.setDomainInfo(domainInfo);

      if (table.getCodes() != null) {
        for (gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Code c : table.getCodes()) {
          InternalCode code = new InternalCode();
          code.setCodeSystemId(c.getCodeSystem());
          code.setDescription(c.getLabel());
          code.setValue(c.getValue());
          if (c.getCodeUsage().equals("R")) {
            code.setUsage(CodeUsage.R);
          } else if (c.getCodeUsage().equals("E")) {
            code.setUsage(CodeUsage.E);
          } else {
            code.setUsage(CodeUsage.P);
          }
          v.addCode(code);
        }
        v.setNumberOfCodes(table.getCodes().size());
      }
    }
    valuesetService.createFromLegacy(v, table.getId());
  }
  
  private void init() {
    valuesetService.removeCollection();
    codeSystemService.removeCollection();
  }
}
