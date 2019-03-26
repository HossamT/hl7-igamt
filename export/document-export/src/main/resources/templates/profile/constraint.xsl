<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/displayConstraint.xsl" />
	<xsl:import href="/templates/profile/displayConstraintForPredicate.xsl" />

	<xsl:template name="Constraint">
		<xsl:param name="title" />
		<xsl:param name="type" />
		<xsl:param name="constraintMode" />
		<xsl:param name="headerLevel" />

		<xsl:choose>
			<xsl:when test="$type='pre'">
 				<xsl:call-template name="displayConstraint">
						<xsl:with-param name="constraintMode" select="$constraintMode" />
						<xsl:with-param name="title" select="$title" />
						<xsl:with-param name="type" select="$type" />
						<xsl:with-param name="headerLevel" select="$headerLevel" />
					</xsl:call-template>
 			</xsl:when>
			<xsl:when test="$type='cs'">
 					<xsl:call-template name="displayConstraint">
						<xsl:with-param name="constraintMode" select="$constraintMode" />
						<xsl:with-param name="title" select="$title" />
						<xsl:with-param name="type" select="$type" />
						<xsl:with-param name="headerLevel" select="$headerLevel" />
					</xsl:call-template>
 		</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
