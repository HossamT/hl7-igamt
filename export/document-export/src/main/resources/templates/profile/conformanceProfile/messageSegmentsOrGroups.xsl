<!--<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">-->
<!--<xsl:include href="/templates/profile/conformanceProfile/messageSegment.xsl"/>-->

<!--<xsl:template name="displayMessageSegmentsOrGroups">-->
<!--    <xsl:param name="changes"/>-->
<!--    <xsl:for-each select="SegmentRef|Group">-->
<!--        <xsl:if test="name(.)='SegmentRef'">-->
<!--            <xsl:apply-templates select="."/>-->
<!--        </xsl:if>-->
<!--        <xsl:if test="name(.)='Group'">-->
<!--            <xsl:call-template name="displayMessageSegmentsOrGroups"/>-->
<!--        </xsl:if>-->

<!--    </xsl:for-each>-->
<!--</xsl:template>-->

<!--</xsl:stylesheet>-->


<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:include href="/templates/profile/conformanceProfile/messageSegment.xsl"/>

<xsl:template name="displayMessageSegmentsOrGroups">
    <xsl:param name="changes"/>
    <xsl:for-each select="SegmentRef|Group">
        <xsl:variable name="changedPosition" select="./@position" />
        <xsl:choose>
            <xsl:when test="not($changes/@mode) or $changes/@mode = 'HIGHLIGHT'">
                <xsl:if test="name(.)='SegmentRef'">

                    <xsl:apply-templates select=".">
                        <xsl:with-param name="changeClass" select="$changes/Change[@position=$changedPosition]"  />
                        <xsl:with-param name="updatedColor" select="$changes/@updatedColor" />
                        <xsl:with-param name="addedColor" select="$changes/@addedColor" />
                        <xsl:with-param name="deletedColor" select="$changes/@deletedColor" />
                    </xsl:apply-templates>
                </xsl:if>
                <xsl:if test="name(.)='Group'">
                    <xsl:call-template name="displayMessageSegmentsOrGroups">
                        <xsl:with-param name="changes" select="$changes/Changes[@position=$changedPosition]"/>
                    </xsl:call-template>
                </xsl:if>
            </xsl:when>
            <xsl:otherwise>
                <xsl:if test="../Changes/Change[@position=$changedPosition]">
                    <xsl:if test="name(.)='SegmentRef'">
                        <xsl:apply-templates select=".">
                            <xsl:with-param name="changeClass" select="$changes/Change[@position=$changedPosition]"  />
                            <xsl:with-param name="updatedColor" select="$changes/@updatedColor" />
                            <xsl:with-param name="addedColor" select="$changes/@addedColor" />
                            <xsl:with-param name="deletedColor" select="$changes/@deletedColor" />
                        </xsl:apply-templates>
                    </xsl:if>
                    <xsl:if test="name(.)='Group'">
                        <xsl:call-template name="displayMessageSegmentsOrGroups">
                            <xsl:with-param name="changes" select="$changes/Changes[@position=$changedPosition]"/>
                        </xsl:call-template>
                    </xsl:if>
                </xsl:if>
            </xsl:otherwise>
        </xsl:choose>


    </xsl:for-each>
</xsl:template>

</xsl:stylesheet>
